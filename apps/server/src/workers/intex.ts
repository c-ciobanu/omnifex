import { checkMovieChangesWorker } from "./checkMovieChanges";
import { checkShowChangesWorker } from "./checkShowChanges";
import { migrateMangasToMangaBakaWorker } from "./migrateMangasToMangaBaka";
import { updateMovieWorker } from "./updateMovie";
import { updateShowWorker } from "./updateShow";

export const workers = [
  checkMovieChangesWorker,
  checkShowChangesWorker,
  migrateMangasToMangaBakaWorker,
  updateMovieWorker,
  updateShowWorker,
];
