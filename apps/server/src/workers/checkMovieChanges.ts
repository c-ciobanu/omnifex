import { Worker } from "bullmq";

import { prisma } from "@omnifex/db";

import { getTMDBMovieChanges } from "../lib/tmdb";
import { checkMovieChangesQueue, updateMovieQueue } from "../queues/index";
import { defaultWorkerOptions } from "./config";

export const checkMovieChangesWorker = new Worker(
  checkMovieChangesQueue.name,
  async () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const to = date.toISOString().slice(0, 10);
    date.setDate(date.getDate() - 6);
    const from = date.toISOString().slice(0, 10);

    const data = await getTMDBMovieChanges(1, from, to);

    const results = data.results.map((e) => e.id);

    for (let index = 2; index <= data.total_pages; index++) {
      const otherChanges = await getTMDBMovieChanges(index, from, to);

      results.push(...otherChanges.results.map((e) => e.id));
    }

    const moviesToUpdate = await prisma.movie.findMany({
      where: { tmdbId: { in: results } },
      select: { tmdbId: true },
    });

    await updateMovieQueue.addBulk(moviesToUpdate.map((movie) => ({ name: String(movie.tmdbId), data: movie })));
  },
  defaultWorkerOptions,
);
