import type { MutationResolvers } from 'types/graphql'

import { validateWith } from '@redwoodjs/api'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const createWatchlistItemMovie: MutationResolvers['createWatchlistItemMovie'] = async ({ input }) => {
  requireAuth()

  await validateWith(async () => {
    const watchedMovieCount = await db.watchedMovie.count({
      where: { ...input, userId: context.currentUser.id },
    })

    if (watchedMovieCount === 1) {
      throw new Error('Unable to add a watched movie to the watchlist')
    }
  })

  return db.watchlistItemMovie.create({
    data: { ...input, userId: context.currentUser.id },
  })
}

export const deleteWatchlistItemMovie: MutationResolvers['deleteWatchlistItemMovie'] = ({ movieId }) => {
  requireAuth()

  return db.watchlistItemMovie.delete({
    where: { movieId_userId: { movieId, userId: context.currentUser.id } },
  })
}
