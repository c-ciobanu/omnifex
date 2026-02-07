import { Worker } from "bullmq";

import { prisma } from "@omnifex/db";

import { getMangaByMangaUpdatesId } from "../lib/mangaBaka";
import { migrateMangasToMangaBakaQueue } from "../queues/index";
import { defaultWorkerOptions } from "./config";

export const migrateMangasToMangaBakaWorker = new Worker(
  migrateMangasToMangaBakaQueue.name,
  async (job) => {
    let updates = 0;

    const mangas = await prisma.manga.findMany({ where: { mangaBakaId: null } });

    for (const manga of mangas) {
      if (!manga.mangaUpdatesId) {
        await job.log(`${manga.title} [${manga.mangaUpdatesId}] skipped`);
        continue;
      }

      const [mangaBakaManga, error] = await getMangaByMangaUpdatesId(manga.mangaUpdatesId);

      if (error) {
        await job.log(`Updated ${updates} mangas before error`);
        throw error;
      }

      if (!mangaBakaManga) {
        await job.log(`${manga.title} [${manga.mangaUpdatesId}] not found on MangaBaka`);
        continue;
      }

      await prisma.manga.update({
        where: { id: manga.id },
        data: {
          chapters: mangaBakaManga.total_chapters ? Number(mangaBakaManga.total_chapters) : undefined,
          coverUrl: mangaBakaManga.cover.x350.x1 ?? undefined,
          description: mangaBakaManga.description ?? undefined,
          malId: mangaBakaManga.source.my_anime_list.id ? String(mangaBakaManga.source.my_anime_list.id) : undefined,
          mangaBakaId: String(mangaBakaManga.id),
        },
      });

      updates++;
    }

    return `Updated ${updates} out of ${mangas.length} mangas`;
  },
  defaultWorkerOptions,
);
