import type { MutationResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const createWatchedMovie: MutationResolvers['createWatchedMovie'] = ({ input }) => {
  requireAuth()

  return db.watchedMovie.create({
    data: { ...input, userId: context.currentUser.id },
  })
}

export const deleteWatchedMovie: MutationResolvers['deleteWatchedMovie'] = ({ tmdbId }) => {
  requireAuth()

  return db.watchedMovie.delete({
    where: { tmdbId_userId: { tmdbId, userId: context.currentUser.id } },
  })
}
