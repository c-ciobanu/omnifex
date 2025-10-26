import { BookListType } from '@prisma/client'
import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import { mapBookToGraphql } from './books'
import { isBookInReadingList, unreadingListBook } from './readingList'

export const isBookRead = async (id: number) => {
  requireAuth()

  const count = await db.bookListItem.count({
    where: { bookId: id, list: { type: BookListType.READ, userId: context.currentUser.id } },
  })

  return count === 1
}

export const readBooks: QueryResolvers['readBooks'] = async () => {
  requireAuth()

  const bookListItems = await db.bookList
    .findFirst({ where: { type: BookListType.READ, userId: context.currentUser.id } })
    .books({ select: { book: true } })

  return bookListItems.map((listItem) => mapBookToGraphql(listItem.book))
}

export const readBook: MutationResolvers['readBook'] = async ({ id }) => {
  requireAuth()

  const inReadingList = await isBookInReadingList(id)

  if (inReadingList) {
    await unreadingListBook({ id })
  }

  const list = await db.bookList.findFirst({
    where: { userId: context.currentUser.id, type: BookListType.READ },
    select: { id: true },
  })

  return db.bookListItem.create({ data: { listId: list.id, bookId: id } })
}

export const unreadBook: MutationResolvers['unreadBook'] = async ({ id }) => {
  requireAuth()

  const list = await db.bookList.findFirst({
    where: { userId: context.currentUser.id, type: BookListType.READ },
    select: { id: true },
  })

  return db.bookListItem.delete({ where: { listId_bookId: { listId: list.id, bookId: id } } })
}
