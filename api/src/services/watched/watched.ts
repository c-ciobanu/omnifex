import type { MutationResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const createWatched: MutationResolvers['createWatched'] = ({ input }) => {
  requireAuth()

  return db.watched.create({
    data: { ...input, userId: context.currentUser.id },
  })
}

export const deleteWatched: MutationResolvers['deleteWatched'] = ({ tmdbId }) => {
  requireAuth()

  return db.watched.delete({
    where: { tmdbId_userId: { tmdbId, userId: context.currentUser.id } },
  })
}
