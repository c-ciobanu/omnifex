import type { books_v1 } from "@googleapis/books";
import { books } from "@googleapis/books";

import { env } from "../env";

const booksAPI = books({
  version: "v1",
  auth: env.GOOGLE_BOOKS_API_KEY,
});

export type GoogleBook = Omit<books_v1.Schema$Volume, "id" | "volumeInfo"> & {
  id: NonNullable<books_v1.Schema$Volume["id"]>;
  volumeInfo: NonNullable<books_v1.Schema$Volume["volumeInfo"]> & {
    description: NonNullable<NonNullable<books_v1.Schema$Volume["volumeInfo"]>["description"]>;
    publishedDate: NonNullable<NonNullable<books_v1.Schema$Volume["volumeInfo"]>["publishedDate"]>;
    title: NonNullable<NonNullable<books_v1.Schema$Volume["volumeInfo"]>["title"]>;
    pageCount: NonNullable<NonNullable<books_v1.Schema$Volume["volumeInfo"]>["pageCount"]>;
    categories: NonNullable<NonNullable<books_v1.Schema$Volume["volumeInfo"]>["categories"]>;
  };
};

export const searchGoogleBooks = async ({ title }: { title: string }) => {
  const response = await booksAPI.volumes.list({
    q: title,
    printType: "books",
    maxResults: 40,
    orderBy: "relevance",
  });

  return response.data.items;
};

export const getGoogleBook = async (googleId: string) => {
  const response = await booksAPI.volumes.get({ volumeId: googleId });

  return response.data as GoogleBook;
};
