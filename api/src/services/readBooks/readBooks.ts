import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import { deleteToReadBook } from '../toReadBooks/toReadBooks'

export const readBooks: QueryResolvers['readBooks'] = async ({ input }) => {
  requireAuth()

  const readBooks = await db.readBook.findMany({
    where: { userId: context.currentUser.id },
    select: { book: true },
    take: input.take,
    orderBy: { createdAt: 'desc' },
  })

  const books = readBooks.map((fm) => fm.book)

  return books.map((b) => ({
    ...b,
    coverUrl: `https://books.google.com/books/content?id=${b.googleId}&printsec=frontcover&img=1&zoom=1`,
  }))
}

export const createReadBook: MutationResolvers['createReadBook'] = async ({ input }) => {
  requireAuth()

  const toReadBookCount = await db.toReadBook.count({
    where: { ...input, userId: context.currentUser.id },
  })

  if (toReadBookCount === 1) {
    await deleteToReadBook(input)
  }

  return db.readBook.create({
    data: { ...input, userId: context.currentUser.id },
  })
}

export const deleteReadBook: MutationResolvers['deleteReadBook'] = ({ bookId }) => {
  requireAuth()

  return db.readBook.delete({
    where: { bookId_userId: { bookId, userId: context.currentUser.id } },
  })
}
