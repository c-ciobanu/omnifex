import { Worker } from "bullmq";

import { prisma } from "@omnifex/db";

import { getTMDBShowChanges } from "../lib/tmdb";
import { checkShowChangesQueue, updateShowQueue } from "../queues/index";
import { defaultWorkerOptions } from "./config";

export const checkShowChangesWorker = new Worker(
  checkShowChangesQueue.name,
  async () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const to = date.toISOString().slice(0, 10);
    date.setDate(date.getDate() - 6);
    const from = date.toISOString().slice(0, 10);

    const data = await getTMDBShowChanges(1, from, to);

    const results = data.results.map((e) => e.id);

    for (let index = 2; index <= data.total_pages; index++) {
      const otherChanges = await getTMDBShowChanges(index, from, to);

      results.push(...otherChanges.results.map((e) => e.id));
    }

    const showsToUpdate = await prisma.show.findMany({ where: { tmdbId: { in: results } }, select: { tmdbId: true } });

    await updateShowQueue.addBulk(showsToUpdate.map((show) => ({ name: String(show.tmdbId), data: show })));
  },
  defaultWorkerOptions,
);
