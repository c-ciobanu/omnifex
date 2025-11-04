import { Queue } from "bullmq";

import { defaultQueueOptions } from "./config";

export const checkMovieChangesQueue = new Queue("check-movie-changes", defaultQueueOptions);

export interface UpdateMovieDataType {
  tmdbId: number;
}

export const updateMovieQueue = new Queue<UpdateMovieDataType>("update-movie-job", defaultQueueOptions);

export const queues = [checkMovieChangesQueue, updateMovieQueue];
