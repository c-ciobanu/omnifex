import type { RouterClient } from "@orpc/server";

import { bookmarksRouter } from "./bookmarks";
import { booksRouter } from "./books";
import { documentsRouter } from "./documents";
import { filesRouter } from "./files";
import { mangasRouter } from "./mangas";
import { metricsRouter } from "./metrics";
import { moviesRouter } from "./movies";
import { recipesRouter } from "./recipes";
import { remindersRouter } from "./reminders";
import { shoppingListsRouter } from "./shoppingLists";
import { showsRouter } from "./shows";
import { toDoListsRouter } from "./toDoLists";

export const appRouter = {
  books: booksRouter,
  bookmarks: bookmarksRouter,
  documents: documentsRouter,
  files: filesRouter,
  mangas: mangasRouter,
  metrics: metricsRouter,
  movies: moviesRouter,
  recipes: recipesRouter,
  reminders: remindersRouter,
  shoppingLists: shoppingListsRouter,
  shows: showsRouter,
  toDoLists: toDoListsRouter,
};

type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<AppRouter>;
