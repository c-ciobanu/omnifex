import type { PrismaClient } from '@prisma/client'

export default async ({ db }: { db: PrismaClient }) => {
  await db.movieList.deleteMany({ where: { name: 'Favorites' } })
  await db.bookList.deleteMany({ where: { name: 'Favorites' } })
}
