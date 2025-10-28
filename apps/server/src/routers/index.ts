import type { RouterClient } from "@orpc/server";

import { publicProcedure } from "../lib/orpc";
import { moviesRouter } from "./movies";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  movies: moviesRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
