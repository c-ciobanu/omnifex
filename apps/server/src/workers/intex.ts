import { checkMovieChangesWorker } from "./checkMovieChanges";
import { checkShowChangesWorker } from "./checkShowChanges";
import { updateMangaWorker } from "./updateManga";
import { updateMangasWorker } from "./updateMangas";
import { updateMovieWorker } from "./updateMovie";
import { updateShowWorker } from "./updateShow";

export const workers = [
  checkMovieChangesWorker,
  checkShowChangesWorker,
  updateMangaWorker,
  updateMangasWorker,
  updateMovieWorker,
  updateShowWorker,
];
