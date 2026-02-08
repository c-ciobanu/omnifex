import { Worker } from "bullmq";

import { prisma } from "@omnifex/db";

import type { UpdateMangaDataType } from "../queues/index";
import { getManga } from "../lib/mangaBaka";
import { updateMangaQueue } from "../queues/index";
import { MANGA_BAKA_STATUS_MAP } from "../routers/mangas";
import { defaultWorkerOptions } from "./config";

export const updateMangaWorker = new Worker<UpdateMangaDataType>(
  updateMangaQueue.name,
  async (job) => {
    const { mangaBakaId } = job.data;

    const [mangaBakaManga, error] = await getManga(mangaBakaId);

    if (error) {
      throw error;
    }

    const coverUrl = mangaBakaManga.cover.x350.x1;
    const description = mangaBakaManga.description;
    const releaseYear = mangaBakaManga.year;
    const title = mangaBakaManga.title;
    const chapters = mangaBakaManga.total_chapters ? Number(mangaBakaManga.total_chapters) : undefined;

    if (!chapters || !coverUrl || !description || !releaseYear || !title || mangaBakaManga.status === "unknown") {
      throw new Error("Data not conform");
    }

    await prisma.manga.update({
      where: { mangaBakaId },
      data: {
        aniListId: mangaBakaManga.source.anilist.id ? String(mangaBakaManga.source.anilist.id) : undefined,
        artists: mangaBakaManga.artists ?? [],
        authors: mangaBakaManga.authors ?? [],
        chapters,
        coverUrl,
        description,
        genres: mangaBakaManga.genres ?? [],
        malId: mangaBakaManga.source.my_anime_list.id ? String(mangaBakaManga.source.my_anime_list.id) : undefined,
        mangaBakaId: String(mangaBakaManga.id),
        mangaUpdatesId: mangaBakaManga.source.manga_updates.id ?? undefined,
        releaseYear,
        status: MANGA_BAKA_STATUS_MAP[mangaBakaManga.status],
        title,
      },
    });
  },
  defaultWorkerOptions,
);
