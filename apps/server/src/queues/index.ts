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

export const updateMangasQueue = new Queue("update-mangas", defaultQueueOptions);

export interface UpdateMangaDataType {
  mangaBakaId: string;
}

export const updateMangaQueue = new Queue<UpdateMangaDataType>("update-manga", defaultQueueOptions);

export interface CreateReminderNotificationDataType {
  reminderId: string;
}

export const createReminderNotificationQueue = new Queue<CreateReminderNotificationDataType>(
  "create-reminder-notification",
  defaultQueueOptions,
);

export const queues = [
  checkMovieChangesQueue,
  checkShowChangesQueue,
  createReminderNotificationQueue,
  updateMangaQueue,
  updateMangasQueue,
  updateMovieQueue,
  updateShowQueue,
];
