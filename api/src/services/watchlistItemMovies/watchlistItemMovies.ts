import type { MutationResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const createWatchlistItemMovie: MutationResolvers['createWatchlistItemMovie'] = ({ input }) => {
  requireAuth()

  return db.watchlistItemMovie.create({
    data: { ...input, userId: context.currentUser.id },
  })
}

export const deleteWatchlistItemMovie: MutationResolvers['deleteWatchlistItemMovie'] = ({ tmdbId }) => {
  requireAuth()

  return db.watchlistItemMovie.delete({
    where: { tmdbId_userId: { tmdbId, userId: context.currentUser.id } },
  })
}
