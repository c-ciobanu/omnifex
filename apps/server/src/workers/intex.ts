import { checkMovieChangesWorker } from "./checkMovieChanges";
import { updateMovieWorker } from "./updateMovie";

export const workers = [checkMovieChangesWorker, updateMovieWorker];
