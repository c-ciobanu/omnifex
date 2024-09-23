import type { PrismaClient, FavoritedMovie, FavoritedBook } from '@prisma/client'

export default async ({ db }: { db: PrismaClient }) => {
  const favoritedMovies = await db.favoritedMovie.findMany({})
  const watchedMovies = await db.watchedMovie.findMany({})
  const toWatchMovies = await db.toWatchMovie.findMany({})

  const favoritedBooks = await db.favoritedBook.findMany({})
  const readBooks = await db.readBook.findMany({})
  const toReadBooks = await db.toReadBook.findMany({})

  const userIds = [
    ...new Set(
      [...favoritedMovies, ...watchedMovies, ...toWatchMovies, ...favoritedBooks, ...readBooks, ...toReadBooks].map(
        (mOrB) => mOrB.userId
      )
    ),
  ]

  const movieLists = await db.movieList.findMany({ where: { userId: { in: userIds } } })
  const bookLists = await db.bookList.findMany({ where: { userId: { in: userIds } } })

  const moviesMapFn = (movie: FavoritedMovie, listName: string) => {
    const list = movieLists.find((movieList) => movieList.userId === movie.userId && movieList.name === listName)!
    return { listId: list.id, movieId: movie.movieId, createdAt: movie.createdAt }
  }
  const booksMapFn = (book: FavoritedBook, listName: string) => {
    const list = bookLists.find((bookList) => bookList.userId === book.userId && bookList.name === listName)!
    return { listId: list.id, bookId: book.bookId, createdAt: book.createdAt }
  }

  await db.movieListItem.createMany({
    data: [
      toWatchMovies.map((m) => moviesMapFn(m, 'Watchlist')),
      watchedMovies.map((m) => moviesMapFn(m, 'Watched')),
      favoritedMovies.map((m) => moviesMapFn(m, 'Favorites')),
    ].flat(),
    skipDuplicates: true,
  })
  await db.bookListItem.createMany({
    data: [
      toReadBooks.map((b) => booksMapFn(b, 'Reading List')),
      readBooks.map((b) => booksMapFn(b, 'Read')),
      favoritedBooks.map((b) => booksMapFn(b, 'Favorites')),
    ].flat(),
    skipDuplicates: true,
  })
}
