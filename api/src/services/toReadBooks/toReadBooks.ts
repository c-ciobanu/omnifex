import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { validateWith } from '@redwoodjs/api'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const toReadBooks: QueryResolvers['toReadBooks'] = async ({ input }) => {
  requireAuth()

  const toReadBooks = await db.toReadBook.findMany({
    where: { userId: context.currentUser.id },
    select: { book: true },
    take: input.take,
    orderBy: { createdAt: 'desc' },
  })

  const books = toReadBooks.map((fm) => fm.book)

  return books.map((b) => ({
    ...b,
    coverUrl: `https://books.google.com/books/content?id=${b.googleId}&printsec=frontcover&img=1&zoom=3`,
  }))
}

export const createToReadBook: MutationResolvers['createToReadBook'] = async ({ input }) => {
  requireAuth()

  await validateWith(async () => {
    const readBookCount = await db.readBook.count({
      where: { ...input, userId: context.currentUser.id },
    })

    if (readBookCount === 1) {
      throw new Error('Unable to add a read book to the reading list')
    }
  })

  return db.toReadBook.create({
    data: { ...input, userId: context.currentUser.id },
  })
}

export const deleteToReadBook: MutationResolvers['deleteToReadBook'] = ({ bookId }) => {
  requireAuth()

  return db.toReadBook.delete({
    where: { bookId_userId: { bookId, userId: context.currentUser.id } },
  })
}
