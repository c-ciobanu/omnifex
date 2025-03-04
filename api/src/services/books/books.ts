import { books_v1 } from '@googleapis/books'
import { BookListType } from '@prisma/client'
import type { BookRelationResolvers, QueryResolvers } from 'types/graphql'

import { cache, deleteCacheKey } from 'src/lib/cache'
import { db } from 'src/lib/db'
import { getGoogleBook, searchGoogleBooks } from 'src/lib/googleBooks'

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

export const book: QueryResolvers['book'] = async ({ googleId }) => {
  let b = await db.book.findUnique({ where: { googleId } })

  if (!b) {
    const googleBook = await getGoogleBook(googleId)

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
    coverUrl: `https://books.google.com/books/content?id=${b.googleId}&printsec=frontcover&img=1&zoom=3`,
  }
}

export const Book: BookRelationResolvers = {
  userInfo: async (_obj, { root }) => {
    if (context.currentUser) {
      const bookListItems = await db.bookListItem.findMany({
        where: { list: { type: { not: BookListType.CUSTOM }, userId: context.currentUser.id }, bookId: root.id },
        select: { list: { select: { type: true } } },
      })

      return {
        read: bookListItems.some((item) => item.list.type === BookListType.READ),
        inReadingList: bookListItems.some((item) => item.list.type === BookListType.READING_LIST),
      }
    }

    return null
  },
}
