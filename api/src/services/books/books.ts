import { books_v1 } from '@googleapis/books'
import { Book as PrismaBook } from '@prisma/client'
import type { BookRelationResolvers, QueryResolvers } from 'types/graphql'

import { cache, deleteCacheKey } from 'src/lib/cache'
import { db } from 'src/lib/db'
import { getGoogleBook, searchGoogleBooks } from 'src/lib/googleBooks'
import { DefaultBookLists, userDefaultBookLists } from 'src/services//bookLists/bookLists'

export const books: QueryResolvers['books'] = async ({ title }) => {
  const googleBooks: books_v1.Schema$Volume[] = await cache(
    ['googleBooks', title],
    () => searchGoogleBooks({ title }),
    { expires: 60 * 60 * 24 * 7 }
  )

  return googleBooks
    .filter(
      (googleBook) =>
        googleBook.volumeInfo.description &&
        googleBook.volumeInfo.publishedDate &&
        googleBook.volumeInfo.pageCount &&
        googleBook.volumeInfo.categories
    )
    .map((googleBook) => ({
      coverUrl: `https://books.google.com/books/content?id=${googleBook.id}&printsec=frontcover&img=1&zoom=1`,
      description: googleBook.volumeInfo.description,
      googleId: googleBook.id,
      publicationYear: Number(googleBook.volumeInfo.publishedDate.split('-')[0]),
      title: googleBook.volumeInfo.title,
    }))
}

type CachedPrismaBook = Omit<PrismaBook, 'publicationDate' | 'createdAt' | 'updatedAt'> & {
  publicationDate: string
  createdAt: string
  updatedAt: string
}

export const book: QueryResolvers['book'] = async ({ googleId }) => {
  let b: PrismaBook | CachedPrismaBook = await cache(
    ['book', googleId],
    () => db.book.findUnique({ where: { googleId } }),
    { expires: 60 * 60 * 24 * 31 }
  )

  if (!b) {
    const googleBook: books_v1.Schema$Volume = await cache(['googleBook', googleId], () => getGoogleBook(googleId), {
      expires: 60 * 60 * 24 * 31,
    })

    if (
      !googleBook.volumeInfo.description ||
      !googleBook.volumeInfo.publishedDate ||
      !googleBook.volumeInfo.pageCount ||
      !googleBook.volumeInfo.categories
    ) {
      return null
    }

    b = await db.book.create({
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
    })

    await deleteCacheKey(['googleBook', googleId])
  }

  return {
    ...b,
    publicationDate: new Date(b.publicationDate),
    coverUrl: `https://books.google.com/books/content?id=${b.googleId}&printsec=frontcover&img=1&zoom=3`,
  }
}

export const Book: BookRelationResolvers = {
  userInfo: async (_obj, { root }) => {
    if (context.currentUser) {
      const userLists = await userDefaultBookLists()

      const favoritedBookCount = await db.bookListItem.count({
        where: { bookId: root.id, listId: userLists[DefaultBookLists.Favorites].id },
      })
      const readBookCount = await db.bookListItem.count({
        where: { bookId: root.id, listId: userLists[DefaultBookLists.Read].id },
      })
      const toReadBookCount = await db.bookListItem.count({
        where: { bookId: root.id, listId: userLists[DefaultBookLists.ReadingList].id },
      })

      return {
        favorited: favoritedBookCount === 1,
        read: readBookCount === 1,
        inReadingList: toReadBookCount === 1,
      }
    }

    return null
  },
}
