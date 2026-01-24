import "dotenv/config";

import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { HonoAdapter } from "@bull-board/hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { validator } from "hono/validator";

import { createContext } from "./context";
import { env } from "./env";
import { auth } from "./lib/auth";
import { queues } from "./queues";
import { appRouter } from "./routers/index";
import { upsertCronJobs } from "./workers/cron";
import { workers } from "./workers/intex";

const app = new Hono();

app.use(logger());

app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

const rpcHandler = new RPCHandler(appRouter, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

app.use("/*", async (c, next) => {
  const context = await createContext({ context: c });

  const rpcResult = await rpcHandler.handle(c.req.raw, {
    prefix: "/rpc",
    context: context,
  });

  if (rpcResult.matched) {
    return c.newResponse(rpcResult.response.body, rpcResult.response);
  }

  await next();
});

const bullMQServerAdapter = new HonoAdapter(serveStatic);

createBullBoard({
  queues: queues.map((queue) => new BullMQAdapter(queue)),
  serverAdapter: bullMQServerAdapter,
  options: {
    uiConfig: { boardTitle: "Omnifex Queues" },
  },
});

bullMQServerAdapter.setBasePath("/queues/dashboard");

app.use("/queues/dashboard/*", basicAuth({ username: "omnifex", password: env.QUEUES_DASHBOARD_PASSWORD }));

app.route("/queues/dashboard", bullMQServerAdapter.registerPlugin());

app.get("/", (c) => {
  return c.text("OK");
});

app.get(
  "/proxy/mangadex",
  validator("query", (value, c) => {
    const { url } = value;

    if (!url || typeof url !== "string") {
      return c.text("url query param is required", 400);
    }

    return { url };
  }),
  async (c) => {
    const { url } = c.req.valid("query");

    const response = await fetch(url);

    if (!response.ok) {
      return c.notFound();
    }

    const imageBuffer = await response.arrayBuffer();

    return c.body(imageBuffer, 200, {
      "Content-Type": response.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=604800",
    });
  },
);

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

await upsertCronJobs();

void Promise.all(workers.map((worker) => worker.run()));

const gracefulShutdown = async (signal: "SIGINT" | "SIGTERM") => {
  console.log(`Received ${signal}, closing server...`);

  await Promise.all(workers.map((worker) => worker.close()));

  process.exit(0);
};

process.on("SIGINT", () => void gracefulShutdown("SIGINT"));

process.on("SIGTERM", () => void gracefulShutdown("SIGTERM"));
