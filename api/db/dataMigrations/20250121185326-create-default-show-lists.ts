import type { PrismaClient } from '@prisma/client'

export default async ({ db }: { db: PrismaClient }) => {
  const users = await db.user.findMany({
    where: { showLists: { none: {} } },
    select: { id: true },
  })

  await db.showList.createMany({
    data: users.flatMap(({ id: userId }) => [
      { name: 'Watchlist', userId },
      { name: 'Abandoned', userId },
      { name: 'Watched', userId },
    ]),
  })
}
