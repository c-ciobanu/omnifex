import { MutationResolvers, QueryResolvers } from 'types/graphql'

import { validateWith } from '@redwoodjs/api'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

const favoritedBooks = async () => {
  const favoritedBooks = await db.favoritedBook.findMany({
    where: { userId: context.currentUser.id },
    select: { book: true },
    orderBy: { createdAt: 'desc' },
  })

  const books = favoritedBooks.map((fm) => fm.book)

  return books.map((b) => ({
    ...b,
    coverUrl: `https://books.google.com/books/content?id=${b.googleId}&printsec=frontcover&img=1&zoom=1`,
  }))
}

const readBooks = async () => {
  const readBooks = await db.readBook.findMany({
    where: { userId: context.currentUser.id },
    select: { book: true },
    orderBy: { createdAt: 'desc' },
  })

  const books = readBooks.map((fm) => fm.book)

  return books.map((b) => ({
    ...b,
    coverUrl: `https://books.google.com/books/content?id=${b.googleId}&printsec=frontcover&img=1&zoom=1`,
  }))
}

const toReadBooks = async () => {
  const toReadBooks = await db.toReadBook.findMany({
    where: { userId: context.currentUser.id },
    select: { book: true },
    orderBy: { createdAt: 'desc' },
  })

  const books = toReadBooks.map((fm) => fm.book)

  return books.map((b) => ({
    ...b,
    coverUrl: `https://books.google.com/books/content?id=${b.googleId}&printsec=frontcover&img=1&zoom=1`,
  }))
}

export const userBooks: QueryResolvers['userBooks'] = ({ type }) => {
  requireAuth()

  if (type === 'FAVORITED') {
    return favoritedBooks()
  } else if (type === 'READ') {
    return readBooks()
  } else {
    return toReadBooks()
  }
}

const createBookListItem = async (listName: string, bookId: number) => {
  const list = await db.bookList.findFirst({
    where: { userId: context.currentUser.id, name: listName },
    select: { id: true },
  })

  await db.bookListItem.create({ data: { bookId, listId: list.id } })
}

const createFavoritedBook = async (bookId: number) => {
  await createBookListItem('Favorites', bookId)

  return db.favoritedBook.create({ data: { bookId, userId: context.currentUser.id } })
}

const createReadBook = async (bookId: number) => {
  const toReadBookCount = await db.toReadBook.count({ where: { bookId, userId: context.currentUser.id } })

  if (toReadBookCount === 1) {
    await deleteBookListItem('Reading List', bookId)

    await deleteToReadBook(bookId)
  }

  await createBookListItem('Read', bookId)

  return db.readBook.create({ data: { bookId, userId: context.currentUser.id } })
}

const createToReadBook = async (bookId: number) => {
  await validateWith(async () => {
    const readBookCount = await db.readBook.count({ where: { bookId, userId: context.currentUser.id } })

    if (readBookCount === 1) {
      throw new Error('Unable to add a read book to the reading list')
    }
  })

  await createBookListItem('Reading List', bookId)

  return db.toReadBook.create({ data: { bookId, userId: context.currentUser.id } })
}

export const createUserBook: MutationResolvers['createUserBook'] = ({ input: { bookId, type } }) => {
  requireAuth()

  if (type === 'FAVORITED') {
    return createFavoritedBook(bookId)
  } else if (type === 'READ') {
    return createReadBook(bookId)
  } else {
    return createToReadBook(bookId)
  }
}

const deleteBookListItem = async (listName: string, bookId: number) => {
  const list = await db.bookList.findFirst({
    where: { userId: context.currentUser.id, name: listName },
    select: { id: true },
  })

  await db.bookListItem.deleteMany({ where: { bookId, listId: list.id } })
}

const deleteFavoritedBook = async (bookId) => {
  await deleteBookListItem('Favorites', bookId)

  return db.favoritedBook.delete({ where: { bookId_userId: { bookId, userId: context.currentUser.id } } })
}

const deleteReadBook = async (bookId) => {
  await deleteBookListItem('Read', bookId)

  return db.readBook.delete({ where: { bookId_userId: { bookId, userId: context.currentUser.id } } })
}

const deleteToReadBook = async (bookId) => {
  await deleteBookListItem('Reading List', bookId)

  return db.toReadBook.delete({ where: { bookId_userId: { bookId, userId: context.currentUser.id } } })
}

export const deleteUserBook: MutationResolvers['deleteUserBook'] = ({ bookId, type }) => {
  requireAuth()

  if (type === 'FAVORITED') {
    return deleteFavoritedBook(bookId)
  } else if (type === 'READ') {
    return deleteReadBook(bookId)
  } else {
    return deleteToReadBook(bookId)
  }
}
