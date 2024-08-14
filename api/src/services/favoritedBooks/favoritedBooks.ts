import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const favoritedBooks: QueryResolvers['favoritedBooks'] = async ({ input }) => {
  requireAuth()

  const favoritedBooks = await db.favoritedBook.findMany({
    where: { userId: context.currentUser.id },
    select: { book: true },
    take: input.take,
    orderBy: { createdAt: 'desc' },
  })

  const books = favoritedBooks.map((fm) => fm.book)

  return books.map((b) => ({
    ...b,
    coverUrl: `https://books.google.com/books/content?id=${b.googleId}&printsec=frontcover&img=1&zoom=1`,
  }))
}

export const createFavoritedBook: MutationResolvers['createFavoritedBook'] = ({ input }) => {
  requireAuth()

  return db.favoritedBook.create({
    data: { ...input, userId: context.currentUser.id },
  })
}

export const deleteFavoritedBook: MutationResolvers['deleteFavoritedBook'] = ({ bookId }) => {
  requireAuth()

  return db.favoritedBook.delete({
    where: { bookId_userId: { bookId, userId: context.currentUser.id } },
  })
}
