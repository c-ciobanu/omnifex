import type { RouterClient } from "@orpc/server";

import { bookmarksRouter } from "./bookmarks";
import { booksRouter } from "./books";
import { documentsRouter } from "./documents";
import { metricsRouter } from "./metrics";
import { moviesRouter } from "./movies";
import { shoppingListsRouter } from "./shoppingLists";
import { showsRouter } from "./shows";

export const appRouter = {
  books: booksRouter,
  bookmarks: bookmarksRouter,
  documents: documentsRouter,
  metrics: metricsRouter,
  movies: moviesRouter,
  shoppingLists: shoppingListsRouter,
  shows: showsRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
