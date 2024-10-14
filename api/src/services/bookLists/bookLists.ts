import type { QueryResolvers, MutationResolvers } from 'types/graphql'

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

export enum DefaultBookLists {
  ReadingList = 0,
  Read = 1,
  Favorites = 2,
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

export const userDefaultBookLists = () => {
  requireAuth()

  return db.bookList.findMany({
    where: { userId: context.currentUser.id, name: { in: ['Reading List', 'Read', 'Favorites'] } },
    select: { id: true, name: true },
    orderBy: { name: 'desc' },
  })
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

  if (listName === 'Read') {
    const readingListBookCount = await db.bookListItem.count({
      where: { bookId, list: { userId: context.currentUser.id, name: 'Reading List' } },
    })

    if (readingListBookCount === 1) {
      await deleteBookListItem({ listName: 'Reading_List', bookId })
    }
  } else if (listName === 'Reading_List') {
    await validateWith(async () => {
      const readBookCount = await db.bookListItem.count({
        where: { bookId, list: { userId: context.currentUser.id, name: 'Read' } },
      })

      if (readBookCount === 1) {
        throw new Error('Unable to add a read book to the reading list.')
      }
    })
  }

  const list = await db.bookList.findFirst({
    where: { userId: context.currentUser.id, name: listName === 'Reading_List' ? 'Reading List' : listName },
    select: { id: true },
  })

  return db.bookListItem.create({ data: { listId: list.id, bookId } })
}

export const deleteBookListItem: MutationResolvers['deleteBookListItem'] = async ({ listName, bookId }) => {
  requireAuth()

  const list = await db.bookList.findFirst({
    where: { userId: context.currentUser.id, name: listName === 'Reading_List' ? 'Reading List' : listName },
    select: { id: true },
  })

  return db.bookListItem.delete({ where: { listId_bookId: { listId: list.id, bookId } } })
}
