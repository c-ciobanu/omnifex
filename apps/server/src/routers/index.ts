import type { RouterClient } from "@orpc/server";

import { publicProcedure } from "../lib/orpc";
import { documentsRouter } from "./documents";
import { metricsRouter } from "./metrics";
import { moviesRouter } from "./movies";
import { showsRouter } from "./shows";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  documents: documentsRouter,
  metrics: metricsRouter,
  movies: moviesRouter,
  shows: showsRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
