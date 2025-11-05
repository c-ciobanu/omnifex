import { ORPCError } from "@orpc/server";
import * as z from "zod";

import type { Book } from "@omnifex/db";
import { BookListType, prisma } from "@omnifex/db";

import type { GoogleBook } from "../lib/googleBooks";
import { getGoogleBook, searchGoogleBooks } from "../lib/googleBooks";
import { protectedProcedure, publicProcedure } from "../lib/orpc";

const mapBook = <T extends Book>(book: T) => ({
  ...book,
  coverUrl: `https://books.google.com/books/content?id=${book.googleId}&printsec=frontcover&img=1&zoom=3`,
});

export const isBookRead = async (id: number, userId: string) => {
  const count = await prisma.bookListItem.count({
    where: { bookId: id, list: { type: BookListType.READ, userId } },
  });

  return count === 1;
};

export const isBookInReadingList = async (id: number, userId: string) => {
  const count = await prisma.bookListItem.count({
    where: { list: { type: BookListType.READING_LIST, userId }, bookId: id },
  });

  return count === 1;
};

const unreadingListBook = async (id: number, userId: string) => {
  const list = await prisma.bookList.findFirst({
    where: { userId, type: BookListType.READING_LIST },
    select: { id: true },
  });

  if (!list) {
    throw new ORPCError("INTERNAL_SERVER_ERROR");
  }

  return prisma.bookListItem.delete({ where: { listId_bookId: { listId: list.id, bookId: id } } });
};

export const booksRouter = {
  find: publicProcedure.input(z.object({ title: z.string().min(1) })).handler(async ({ input }) => {
    const googleBooks = await searchGoogleBooks({ title: input.title });

    if (!googleBooks) {
      return [];
    }

    return googleBooks
      .filter(
        (googleBook): googleBook is GoogleBook =>
          googleBook.volumeInfo?.description !== undefined &&
          googleBook.volumeInfo.publishedDate !== undefined &&
          googleBook.volumeInfo.pageCount !== undefined &&
          googleBook.volumeInfo.title !== undefined &&
          googleBook.volumeInfo.categories !== undefined,
      )
      .map((googleBook) => ({
        coverUrl: `https://books.google.com/books/content?id=${googleBook.id}&printsec=frontcover&img=1&zoom=1`,
        description: googleBook.volumeInfo.description,
        googleId: googleBook.id,
        publicationYear: Number(googleBook.volumeInfo.publishedDate.split("-")[0]),
        title: googleBook.volumeInfo.title,
      }));
  }),

  get: publicProcedure.input(z.object({ googleId: z.string().min(1) })).handler(async ({ input, context }) => {
    let book = await prisma.book.findUnique({ where: { googleId: input.googleId } });

    if (!book) {
      const googleBook = await getGoogleBook(input.googleId);

      book = await prisma.book.create({
        data: {
          authors: googleBook.volumeInfo.authors,
          description: googleBook.volumeInfo.description,
          genres: googleBook.volumeInfo.categories,
          googleId: googleBook.id,
          pages: googleBook.volumeInfo.pageCount,
          publicationDate: new Date(googleBook.volumeInfo.publishedDate),
          subtitle: googleBook.volumeInfo.subtitle,
          title: googleBook.volumeInfo.title,
        },
      });
    }

    let userInfo;
    if (context.session) {
      const bookListItems = await prisma.bookListItem.findMany({
        where: { list: { type: { not: BookListType.CUSTOM }, userId: context.session.user.id }, bookId: book.id },
        select: { list: { select: { type: true } } },
      });

      userInfo = {
        read: bookListItems.some((item) => item.list.type === BookListType.READ),
        inReadingList: bookListItems.some((item) => item.list.type === BookListType.READING_LIST),
      };
    }

    return { ...mapBook(book), userInfo };
  }),

  getRead: protectedProcedure.handler(async ({ context }) => {
    const bookListItems = await prisma.bookList
      .findFirst({ where: { type: BookListType.READ, userId: context.session.user.id } })
      .books({ select: { book: true } });

    if (!bookListItems) {
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }

    return bookListItems.map((listItem) => mapBook(listItem.book));
  }),

  read: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    const inReadingList = await isBookInReadingList(input.id, context.session.user.id);

    if (inReadingList) {
      await unreadingListBook(input.id, context.session.user.id);
    }

    const list = await prisma.bookList.findFirst({
      where: { userId: context.session.user.id, type: BookListType.READ },
      select: { id: true },
    });

    if (!list) {
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }

    return prisma.bookListItem.create({ data: { listId: list.id, bookId: input.id } });
  }),

  unread: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    const list = await prisma.bookList.findFirst({
      where: { userId: context.session.user.id, type: BookListType.READ },
      select: { id: true },
    });

    if (!list) {
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }

    return prisma.bookListItem.delete({ where: { listId_bookId: { listId: list.id, bookId: input.id } } });
  }),

  getReadingList: protectedProcedure.handler(async ({ context }) => {
    const bookListItems = await prisma.bookList
      .findFirst({ where: { type: BookListType.READING_LIST, userId: context.session.user.id } })
      .books({ select: { book: true } });

    if (!bookListItems) {
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }

    return bookListItems.map((listItem) => mapBook(listItem.book));
  }),

  readingList: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    const read = await isBookRead(input.id, context.session.user.id);

    if (read) {
      throw new ORPCError("CONFLICT", { message: "Unable to add a read book to the reading list" });
    }

    const list = await prisma.bookList.findFirst({
      where: { userId: context.session.user.id, type: BookListType.READING_LIST },
      select: { id: true },
    });

    if (!list) {
      throw new ORPCError("INTERNAL_SERVER_ERROR");
    }

    return prisma.bookListItem.create({ data: { listId: list.id, bookId: input.id } });
  }),

  unreadingList: protectedProcedure.input(z.object({ id: z.int() })).handler(async ({ input, context }) => {
    return unreadingListBook(input.id, context.session.user.id);
  }),
};
