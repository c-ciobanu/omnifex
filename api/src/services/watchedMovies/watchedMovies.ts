import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import { deleteToWatchMovie } from '../toWatchMovies/toWatchMovies'

export const watchedMovies: QueryResolvers['watchedMovies'] = async ({ input }) => {
  requireAuth()

  const watchedMovies = await db.watchedMovie.findMany({
    where: { userId: context.currentUser.id },
    select: { movie: true },
    take: input.take,
    orderBy: { createdAt: 'desc' },
  })

  const movies = watchedMovies.map((fm) => fm.movie)

  return movies.map((m) => ({
    ...m,
    posterUrl: `http://image.tmdb.org/t/p/w185${m.tmdbPosterPath}`,
    rating: m.rating.toNumber(),
  }))
}

export const createWatchedMovie: MutationResolvers['createWatchedMovie'] = async ({ input }) => {
  requireAuth()

  const toWatchMovieCount = await db.toWatchMovie.count({
    where: { ...input, userId: context.currentUser.id },
  })

  if (toWatchMovieCount === 1) {
    await deleteToWatchMovie(input)
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
