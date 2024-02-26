import type { MutationResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import { deleteWatchlistItemMovie } from '../watchlistItemMovies/watchlistItemMovies'

export const createWatchedMovie: MutationResolvers['createWatchedMovie'] = async ({ input }) => {
  requireAuth()

  const watchlistItemMovieCount = await db.watchlistItemMovie.count({
    where: { tmdbId: input.tmdbId, userId: context.currentUser.id },
  })

  if (watchlistItemMovieCount === 1) {
    await deleteWatchlistItemMovie(input)
  }

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
