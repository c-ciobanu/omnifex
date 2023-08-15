import type { MutationResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const createFavorite: MutationResolvers['createFavorite'] = ({ input }) => {
  requireAuth()

  return db.favorite.create({
    data: { ...input, userId: context.currentUser.id },
  })
}

export const deleteFavorite: MutationResolvers['deleteFavorite'] = ({ tmdbId }) => {
  requireAuth()

  return db.favorite.delete({
    where: { tmdbId_userId: { tmdbId, userId: context.currentUser.id } },
  })
}
