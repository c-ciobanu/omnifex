import { Queue } from "bullmq";

import { defaultQueueOptions } from "./config";

export const checkMovieChangesQueue = new Queue("check-movie-changes", defaultQueueOptions);

export interface UpdateMovieDataType {
  tmdbId: number;
}

export const updateMovieQueue = new Queue<UpdateMovieDataType>("update-movie", defaultQueueOptions);

export const checkShowChangesQueue = new Queue("check-show-changes", defaultQueueOptions);

export interface UpdateShowDataType {
  tmdbId: number;
}

export const updateShowQueue = new Queue<UpdateShowDataType>("update-show", defaultQueueOptions);

export const queues = [checkMovieChangesQueue, checkShowChangesQueue, updateMovieQueue, updateShowQueue];
