import { Worker } from "bullmq";
import { millisecondsInSecond } from "date-fns/constants";

import { prisma } from "@omnifex/db";

import { updateMangaQueue, updateMangasQueue } from "../queues/index";
import { defaultWorkerOptions } from "./config";

export const updateMangasWorker = new Worker(
  updateMangasQueue.name,
  async () => {
    const mangas = await prisma.manga.findMany({ select: { mangaBakaId: true } });

    await updateMangaQueue.addBulk(
      mangas.map((manga, index) => ({
        name: manga.mangaBakaId,
        data: manga,
        opts: { delay: millisecondsInSecond * index },
      })),
    );
  },
  defaultWorkerOptions,
);
