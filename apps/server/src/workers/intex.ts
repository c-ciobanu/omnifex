import { checkMovieChangesWorker } from "./checkMovieChanges";
import { checkShowChangesWorker } from "./checkShowChanges";
import { createReminderNotificationWorker } from "./createReminderNotification";
import { updateMangaWorker } from "./updateManga";
import { updateMangasWorker } from "./updateMangas";
import { updateMovieWorker } from "./updateMovie";
import { updateShowWorker } from "./updateShow";

export const workers = [
  checkMovieChangesWorker,
  checkShowChangesWorker,
  createReminderNotificationWorker,
  updateMangaWorker,
  updateMangasWorker,
  updateMovieWorker,
  updateShowWorker,
];
