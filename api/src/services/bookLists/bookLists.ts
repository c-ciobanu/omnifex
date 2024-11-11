import { DefaultBookLists } from 'common'
import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { validateWith } from '@redwoodjs/api'
import { AuthenticationError } from '@redwoodjs/graphql-server'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

const requireBookListOwner = async (listId: number) => {
  const bookListCount = await db.bookList.count({ where: { id: listId, userId: context.currentUser.id } })

  if (bookListCount === 0) {
    throw new AuthenticationError("You don't have permission to do that.")
  }
}

/**
 * Returns information about the 3 default book lists of a user.
 *
 * @remarks
 * It is best used in combination with DefaultBookLists.
 *
 * @example
 * ```ts
 * const lists = await userDefaultBookLists()
 * const readList = lists[DefaultBookLists.Read]
 * ```
 */

export const userDefaultBookLists = async () => {
  requireAuth()

  const bookLists = await db.bookList.findMany({
    where: { userId: context.currentUser.id, name: { in: [DefaultBookLists.ReadingList, DefaultBookLists.Read] } },
    select: { id: true, name: true },
    orderBy: { name: 'desc' },
  })

  return { [DefaultBookLists.ReadingList]: bookLists[0], [DefaultBookLists.Read]: bookLists[1] }
}

export const bookLists: QueryResolvers['bookLists'] = () => {
  requireAuth()

  return db.bookList.findMany({ where: { userId: context.currentUser.id } })
}

export const createBookList: MutationResolvers['createBookList'] = ({ input }) => {
  requireAuth()

  return db.bookList.create({ data: { ...input, userId: context.currentUser.id } })
}

export const updateBookList: MutationResolvers['updateBookList'] = ({ id, input }) => {
  requireAuth()

  return db.bookList.update({ data: input, where: { id, userId: context.currentUser.id } })
}

export const deleteBookList: MutationResolvers['deleteBookList'] = ({ id }) => {
  requireAuth()

  return db.bookList.delete({ where: { id, userId: context.currentUser.id } })
}

export const bookListItems: QueryResolvers['bookListItems'] = async ({ listId }) => {
  requireAuth()
  await requireBookListOwner(listId)

  const bookListItems = await db.bookListItem.findMany({
    where: { listId },
    select: { book: true },
    orderBy: { createdAt: 'desc' },
  })

  const books = bookListItems.map((fm) => fm.book)

  return books.map((b) => ({
    ...b,
    coverUrl: `https://books.google.com/books/content?id=${b.googleId}&printsec=frontcover&img=1&zoom=1`,
  }))
}

export const createBookListItem: MutationResolvers['createBookListItem'] = async ({ input: { listName, bookId } }) => {
  requireAuth()

  if (listName === DefaultBookLists.Read) {
    const readingListBookCount = await db.bookListItem.count({
      where: { bookId, list: { userId: context.currentUser.id, name: DefaultBookLists.ReadingList } },
    })

    if (readingListBookCount === 1) {
      await deleteBookListItem({ listName: DefaultBookLists.ReadingList, bookId })
    }
  } else if (listName === DefaultBookLists.ReadingList) {
    await validateWith(async () => {
      const readBookCount = await db.bookListItem.count({
        where: { bookId, list: { userId: context.currentUser.id, name: DefaultBookLists.Read } },
      })

      if (readBookCount === 1) {
        throw new Error('Unable to add a read book to the reading list.')
      }
    })
  }

  const list = await db.bookList.findFirst({
    where: { userId: context.currentUser.id, name: listName },
    select: { id: true },
  })

  return db.bookListItem.create({ data: { listId: list.id, bookId } })
}

export const deleteBookListItem: MutationResolvers['deleteBookListItem'] = async ({ listName, bookId }) => {
  requireAuth()

  const list = await db.bookList.findFirst({
    where: { userId: context.currentUser.id, name: listName },
    select: { id: true },
  })

  return db.bookListItem.delete({ where: { listId_bookId: { listId: list.id, bookId } } })
}
