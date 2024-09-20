import type { PrismaClient } from '@prisma/client'

export default async ({ db }: { db: PrismaClient }) => {
  const users = await db.user.findMany({
    where: { movieLists: { none: {} }, bookLists: { none: {} } },
    select: { id: true },
  })

  await db.movieList.createMany({
    data: users.flatMap(({ id: userId }) => [
      { name: 'Watchlist', userId },
      { name: 'Watched', userId },
      { name: 'Favorites', userId },
    ]),
  })
  await db.bookList.createMany({
    data: users.flatMap(({ id: userId }) => [
      { name: 'Reading List', userId },
      { name: 'Read', userId },
      { name: 'Favorites', userId },
    ]),
  })
}
