import type { MutationResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const createFavorited: MutationResolvers['createFavorited'] = ({ input }) => {
  requireAuth()

  return db.favorited.create({
    data: { ...input, userId: context.currentUser.id },
  })
}

export const deleteFavorited: MutationResolvers['deleteFavorited'] = ({ tmdbId }) => {
  requireAuth()

  return db.favorited.delete({
    where: { tmdbId_userId: { tmdbId, userId: context.currentUser.id } },
  })
}
