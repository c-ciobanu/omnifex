import { checkMovieChangesWorker } from "./checkMovieChanges";
import { checkShowChangesWorker } from "./checkShowChanges";
import { updateMovieWorker } from "./updateMovie";
import { updateShowWorker } from "./updateShow";

export const workers = [checkMovieChangesWorker, checkShowChangesWorker, updateMovieWorker, updateShowWorker];
