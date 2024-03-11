import type { MutationResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import { deleteWatchlistItemMovie } from '../watchlistItemMovies/watchlistItemMovies'

export const createWatchedMovie: MutationResolvers['createWatchedMovie'] = async ({ input }) => {
  requireAuth()

  const watchlistItemMovieCount = await db.watchlistItemMovie.count({
    where: { ...input, userId: context.currentUser.id },
  })

  if (watchlistItemMovieCount === 1) {
    await deleteWatchlistItemMovie(input)
  }

  return db.watchedMovie.create({
    data: { ...input, userId: context.currentUser.id },
  })
}

export const deleteWatchedMovie: MutationResolvers['deleteWatchedMovie'] = ({ movieId }) => {
  requireAuth()

  return db.watchedMovie.delete({
    where: { movieId_userId: { movieId, userId: context.currentUser.id } },
  })
}
