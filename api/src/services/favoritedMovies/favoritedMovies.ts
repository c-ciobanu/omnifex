import type { MutationResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const createFavoritedMovie: MutationResolvers['createFavoritedMovie'] = ({ input }) => {
  requireAuth()

  return db.favoritedMovie.create({
    data: { ...input, userId: context.currentUser.id },
  })
}

export const deleteFavoritedMovie: MutationResolvers['deleteFavoritedMovie'] = ({ tmdbId }) => {
  requireAuth()

  return db.favoritedMovie.delete({
    where: { tmdbId_userId: { tmdbId, userId: context.currentUser.id } },
  })
}
