import { ORPCError } from "@orpc/server";
import * as z from "zod";

import { MangaStatus, prisma } from "@omnifex/db";

import type { MangaProgressUpdateInput } from "../../../../packages/db/src/generated/models";
import type { Manga as MangaDexManga } from "../lib/mangaDex";
import { getManga, getMangaLatestChapter, searchMangas } from "../lib/mangaDex";
import { protectedProcedure, publicProcedure } from "../lib/orpc";

const MANGA_DEX_STATUS_MAP: Record<MangaDexManga["attributes"]["status"], MangaStatus> = {
  cancelled: MangaStatus.CANCELLED,
  completed: MangaStatus.ENDED,
  hiatus: MangaStatus.ON_HIATUS,
  ongoing: MangaStatus.ONGOING,
};

export const mangasRouter = {
  find: publicProcedure.input(z.object({ title: z.string().min(1) })).handler(async ({ input }) => {
    const mangaDexMangas = await searchMangas({ title: input.title });

    return mangaDexMangas.map((mangaDexManga) => {
      const coverArt = mangaDexManga.relationships.find((e) => e.type === "cover_art");

      const coverUrl = coverArt?.attributes
        ? `https://uploads.mangadex.org/covers/${mangaDexManga.id}/${coverArt.attributes.fileName}.256.jpg`
        : undefined;

      return {
        coverUrl,
        description: mangaDexManga.attributes.description.en,
        mangaDexId: mangaDexManga.id,
        releaseYear: mangaDexManga.attributes.year,
        title: mangaDexManga.attributes.title["ja-ro"] ?? mangaDexManga.attributes.title.en,
      };
    });
  }),

  get: publicProcedure.input(z.object({ mangaDexId: z.string() })).handler(async ({ input, context }) => {
    let manga = await prisma.manga.findUnique({ where: { mangaDexId: input.mangaDexId } });

    if (!manga) {
      const mangaDexManga = await getManga(input.mangaDexId);

      const coverArt = mangaDexManga.relationships.find((e) => e.type === "cover_art");
      const coverUrl = coverArt
        ? `https://uploads.mangadex.org/covers/${mangaDexManga.id}/${coverArt.attributes.fileName}.512.jpg`
        : undefined;

      const genreTags = mangaDexManga.attributes.tags.filter((e) => e.attributes.group === "genre");

      const authors = mangaDexManga.relationships.filter((e) => e.type === "author");
      const artists = mangaDexManga.relationships.filter((e) => e.type === "artist");
      const description = mangaDexManga.attributes.description.en;
      const releaseYear = mangaDexManga.attributes.year;
      const title = mangaDexManga.attributes.title["ja-ro"] ?? mangaDexManga.attributes.title.en;

      if (!coverUrl || !description || !releaseYear || !title) {
        throw new ORPCError("NOT_FOUND");
      }

      let chapters = mangaDexManga.attributes.lastChapter ? Number(mangaDexManga.attributes.lastChapter) : undefined;

      if (!chapters) {
        const lastChapter = await getMangaLatestChapter(mangaDexManga.id);

        chapters = lastChapter ? Number(lastChapter.attributes.chapter) : 0;
      }

      manga = await prisma.manga.create({
        data: {
          aniListId: mangaDexManga.attributes.links?.al,
          artists: artists.map((e) => e.attributes.name),
          authors: authors.map((e) => e.attributes.name),
          chapters,
          coverUrl,
          description,
          genres: genreTags.map((e) => e.attributes.name.en),
          mangaDexId: mangaDexManga.id,
          mangaUpdatesId: mangaDexManga.attributes.links?.mu,
          releaseYear,
          status: MANGA_DEX_STATUS_MAP[mangaDexManga.attributes.status],
          title,
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
