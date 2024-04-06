import type { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'
import { getGoogleBook, searchGoogleBooks } from 'src/lib/googleBooks'

export const books: QueryResolvers['books'] = async ({ title }) => {
  const googleBooks = await searchGoogleBooks({ title })

  return googleBooks.map((googleBook) => ({
    authors: googleBook.volumeInfo.authors,
    coverUrl: `https://books.google.com/books/content?id=${googleBook.id}&printsec=frontcover&img=1&zoom=1`,
    description: googleBook.volumeInfo.description,
    genres: googleBook.volumeInfo.categories,
    googleId: googleBook.id,
    pages: googleBook.volumeInfo.pageCount,
    publicationDate: googleBook.volumeInfo.publishedDate ? new Date(googleBook.volumeInfo.publishedDate) : undefined,
    subtitle: googleBook.volumeInfo.subtitle,
    title: googleBook.volumeInfo.title,
  }))
}

export const book: QueryResolvers['book'] = async ({ googleId }) => {
  let b = await db.book.findUnique({ where: { googleId } })

  if (!b) {
    const googleBook = await getGoogleBook(googleId)

    if (
      !googleBook.volumeInfo.description ||
      googleBook.volumeInfo.publishedDate?.length !== 10 ||
      !googleBook.volumeInfo.pageCount ||
      !googleBook.volumeInfo.categories
    ) {
      return {
        authors: googleBook.volumeInfo.authors,
        coverUrl: `https://books.google.com/books/content?id=${googleBook.id}&printsec=frontcover&img=1&zoom=3`,
        description: googleBook.volumeInfo.description,
        genres: googleBook.volumeInfo.categories,
        googleId: googleBook.id,
        pages: googleBook.volumeInfo.pageCount,
        publicationDate: googleBook.volumeInfo.publishedDate
          ? new Date(googleBook.volumeInfo.publishedDate)
          : undefined,
        subtitle: googleBook.volumeInfo.subtitle,
        title: googleBook.volumeInfo.title,
      }
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
  }

  return {
    ...b,
    coverUrl: `https://books.google.com/books/content?id=${b.googleId}&printsec=frontcover&img=1&zoom=3`,
  }
}
