import { ORPCError } from "@orpc/server";
import * as z from "zod";

import { prisma } from "@omnifex/db";

import { getManga, getMangaLatestChapter, searchMangas } from "../lib/mangaDex";
import { publicProcedure } from "../lib/orpc";

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

  get: publicProcedure.input(z.object({ mangaDexId: z.string() })).handler(async ({ input }) => {
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
          artists: artists.map((e) => e.attributes.name),
          authors: authors.map((e) => e.attributes.name),
          chapters,
          coverUrl,
          description,
          genres: genreTags.map((e) => e.attributes.name.en),
          mangaDexId: mangaDexManga.id,
          releaseYear,
          title,
        },
      });
    }

    return manga;
  }),
};
