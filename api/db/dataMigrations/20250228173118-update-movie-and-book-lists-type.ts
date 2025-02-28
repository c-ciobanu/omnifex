import { BookListType, MovieListType, type PrismaClient } from '@prisma/client'

export default async ({ db }: { db: PrismaClient }) => {
  await db.movieList.updateMany({
    where: { name: 'Watchlist' },
    data: { type: MovieListType.WATCHLIST },
  })
  await db.movieList.updateMany({
    where: { name: 'Watched' },
    data: { type: MovieListType.WATCHED },
  })
  await db.bookList.updateMany({
    where: { name: 'Reading List' },
    data: { type: BookListType.READING_LIST },
  })
  await db.bookList.updateMany({
    where: { name: 'Read' },
    data: { type: BookListType.READ },
  })
}
