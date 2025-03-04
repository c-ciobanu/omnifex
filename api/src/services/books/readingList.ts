import { BookListType } from '@prisma/client'
import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { validateWith } from '@redwoodjs/api'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import { isBookRead } from './read'

export const isBookInReadingList = async (id: number) => {
  requireAuth()

  const count = await db.bookListItem.count({
    where: { list: { type: BookListType.READING_LIST, userId: context.currentUser.id }, bookId: id },
  })

  return count === 1
}

export const booksReadingList: QueryResolvers['booksReadingList'] = async () => {
  requireAuth()

  const bookListItems = await db.bookList
    .findFirst({ where: { type: BookListType.READING_LIST, userId: context.currentUser.id } })
    .books({ select: { book: true } })

  const books = bookListItems.map((listItem) => listItem.book)

  return books.map((b) => ({
    ...b,
    coverUrl: `https://books.google.com/books/content?id=${b.googleId}&printsec=frontcover&img=1&zoom=1`,
  }))
}

export const readingListBook: MutationResolvers['readingListBook'] = async ({ id }) => {
  requireAuth()

  await validateWith(async () => {
    const read = await isBookRead(id)

    if (read) {
      throw new Error('Unable to add a read book to the reading list.')
    }
  })

  const list = await db.bookList.findFirst({
    where: { userId: context.currentUser.id, type: BookListType.READING_LIST },
    select: { id: true },
  })

  return db.bookListItem.create({ data: { listId: list.id, bookId: id } })
}

export const unreadingListBook: MutationResolvers['unreadingListBook'] = async ({ id }) => {
  requireAuth()

  const list = await db.bookList.findFirst({
    where: { userId: context.currentUser.id, type: BookListType.READING_LIST },
    select: { id: true },
  })

  return db.bookListItem.delete({ where: { listId_bookId: { listId: list.id, bookId: id } } })
}
