import type { QueryResolvers } from 'types/graphql'

import { getGoogleBook, searchGoogleBooks } from 'src/lib/googleBooks'

export const books: QueryResolvers['books'] = async ({ title }) => {
  const googleBooks = await searchGoogleBooks({ title })

  return googleBooks.map((googleBook) => ({
    authors: googleBook.volumeInfo.authors,
    coverUrl: googleBook.volumeInfo.imageLinks?.thumbnail,
    description: googleBook.volumeInfo.description,
    genres: googleBook.volumeInfo.categories,
    googleId: googleBook.id,
    pages: googleBook.volumeInfo.pageCount,
    publicationDate: googleBook.volumeInfo.publishedDate,
    subtitle: googleBook.volumeInfo.subtitle,
    title: googleBook.volumeInfo.title,
  }))
}

export const book: QueryResolvers['book'] = async ({ googleId }) => {
  const googleBook = await getGoogleBook(googleId)

  return {
    authors: googleBook.volumeInfo.authors,
    coverUrl: googleBook.volumeInfo.imageLinks?.medium ?? googleBook.volumeInfo.imageLinks?.thumbnail,
    description: googleBook.volumeInfo.description,
    genres: googleBook.volumeInfo.categories,
    googleId: googleBook.id,
    pages: googleBook.volumeInfo.pageCount,
    publicationDate: googleBook.volumeInfo.publishedDate,
    subtitle: googleBook.volumeInfo.subtitle,
    title: googleBook.volumeInfo.title,
  }
}
