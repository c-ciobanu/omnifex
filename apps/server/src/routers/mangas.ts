import { ORPCError } from "@orpc/server";
import * as z from "zod";

import type { MangaProgressUpdateInput } from "@omnifex/db";
import { MangaStatus, prisma } from "@omnifex/db";

import type { MangaBakaStatus } from "../lib/mangaBaka";
import { getMangaByMangaUpdatesId } from "../lib/mangaBaka";
import { searchMangas } from "../lib/mangaUpdates";
import { protectedProcedure, publicProcedure } from "../lib/orpc";

const MANGA_BAKA_STATUS_MAP: Record<Exclude<MangaBakaStatus, "unknown">, MangaStatus> = {
  cancelled: MangaStatus.CANCELLED,
  completed: MangaStatus.ENDED,
  hiatus: MangaStatus.ON_HIATUS,
  releasing: MangaStatus.ONGOING,
  upcoming: MangaStatus.ONGOING,
};

export const mangasRouter = {
  find: publicProcedure.input(z.object({ title: z.string().min(1) })).handler(async ({ input }) => {
    const mangaUpdatesMangas = await searchMangas(input.title);

    return mangaUpdatesMangas
      .map((mangaUpdatesManga) => {
        const mangaUpdatesId = mangaUpdatesManga.url?.split("/").at(-2);

        if (!mangaUpdatesId) {
          return;
        }

        return {
          coverUrl: mangaUpdatesManga.image?.url?.original,
          description: mangaUpdatesManga.description,
          mangaUpdatesId,
          releaseYear: mangaUpdatesManga.year,
          title: mangaUpdatesManga.title,
        };
      })
      .filter((e) => e !== undefined);
  }),

  get: publicProcedure.input(z.object({ mangaUpdatesId: z.string() })).handler(async ({ input, context }) => {
    const { mangaUpdatesId } = input;

    let manga = await prisma.manga.findUnique({ where: { mangaUpdatesId } });

    if (!manga) {
      const [mangaBakaManga, error] = await getMangaByMangaUpdatesId(mangaUpdatesId);

      if (error) {
        throw new ORPCError("CONFLICT", { message: error.message });
      }

      if (!mangaBakaManga) {
        throw new ORPCError("NOT_FOUND");
      }

      const coverUrl = mangaBakaManga.cover.x350.x1;
      const description = mangaBakaManga.description;
      const releaseYear = mangaBakaManga.year;
      const title = mangaBakaManga.title;
      const chapters = mangaBakaManga.total_chapters ? Number(mangaBakaManga.total_chapters) : undefined;

      if (!chapters || !coverUrl || !description || !releaseYear || !title || mangaBakaManga.status === "unknown") {
        throw new ORPCError("NOT_FOUND");
      }

      manga = await prisma.manga.create({
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
          mangaUpdatesId,
          releaseYear,
          status: MANGA_BAKA_STATUS_MAP[mangaBakaManga.status],
          title: mangaBakaManga.title,
        },
      });
    }

    const userProgress = context.session
      ? await prisma.mangaProgress.findFirst({ where: { userId: context.session.user.id, mangaId: manga.id } })
      : null;

    return { ...manga, userProgress };
  }),

  getRead: protectedProcedure.handler(async ({ context }) => {
    const progressList = await prisma.mangaProgress.findMany({
      where: { userId: context.session.user.id, status: "READ" },
      include: { manga: true },
    });

    return progressList.map((e) => e.manga);
  }),

  getReading: protectedProcedure.handler(async ({ context }) => {
    const progressList = await prisma.mangaProgress.findMany({
      where: { userId: context.session.user.id, status: { in: ["READING", "TO_READ"] } },
      include: { manga: true },
    });

    return progressList.map(({ manga, ...userProgress }) => ({ ...manga, userProgress }));
  }),

  getAbandoned: protectedProcedure.handler(async ({ context }) => {
    const progressList = await prisma.mangaProgress.findMany({
      where: { userId: context.session.user.id, status: "ABANDONED" },
      include: { manga: true },
    });

    return progressList.map((e) => e.manga);
  }),

  setLastChapterRead: protectedProcedure
    .input(z.object({ id: z.int(), chapter: z.int().gte(1) }))
    .handler(async ({ input, context }) => {
      const manga = await prisma.manga.findUnique({ where: { id: input.id } });

      if (!manga) {
        throw new ORPCError("NOT_FOUND");
      }

      if (input.chapter > manga.chapters) {
        throw new ORPCError("BAD_REQUEST");
      }

      const data = {
        status: input.chapter === manga.chapters && manga.status === "ENDED" ? "READ" : "READING",
        lastChapterRead: input.chapter,
      } satisfies MangaProgressUpdateInput;

      return prisma.mangaProgress.upsert({
        where: { userId_mangaId: { userId: context.session.user.id, mangaId: input.id } },
        update: data,
        create: { ...data, userId: context.session.user.id, mangaId: input.id },
      });
    }),

  unread: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    const userProgress = await prisma.mangaProgress.findFirst({
      where: { userId: context.session.user.id, mangaId: input.id },
    });

    if (userProgress?.status === "TO_READ") {
      throw new ORPCError("BAD_REQUEST");
    }

    return prisma.mangaProgress.delete({
      where: { userId_mangaId: { userId: context.session.user.id, mangaId: input.id } },
    });
  }),

  addToReadingList: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    const userProgress = await prisma.mangaProgress.findFirst({
      where: { userId: context.session.user.id, mangaId: input.id },
    });

    if (userProgress) {
      throw new ORPCError("BAD_REQUEST");
    }

    return prisma.mangaProgress.create({
      data: { userId: context.session.user.id, mangaId: input.id, status: "TO_READ" },
    });
  }),

  removeFromReadingList: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    const userProgress = await prisma.mangaProgress.findFirst({
      where: { userId: context.session.user.id, mangaId: input.id },
    });

    if (userProgress?.status !== "TO_READ") {
      throw new ORPCError("BAD_REQUEST");
    }

    return prisma.mangaProgress.delete({
      where: { userId_mangaId: { userId: context.session.user.id, mangaId: input.id } },
    });
  }),

  abandon: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    const userProgress = await prisma.mangaProgress.findFirst({
      where: { userId: context.session.user.id, mangaId: input.id },
    });

    if (userProgress?.status !== "READING") {
      throw new ORPCError("BAD_REQUEST");
    }

    return prisma.mangaProgress.update({ where: { id: userProgress.id }, data: { status: "ABANDONED" } });
  }),

  unabandon: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    const userProgress = await prisma.mangaProgress.findFirst({
      where: { userId: context.session.user.id, mangaId: input.id },
    });

    if (userProgress?.status !== "ABANDONED") {
      throw new ORPCError("BAD_REQUEST");
    }

    return prisma.mangaProgress.update({ where: { id: userProgress.id }, data: { status: "READING" } });
  }),
};
