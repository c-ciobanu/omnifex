import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { validateWith } from '@redwoodjs/api'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const toWatchMovies: QueryResolvers['toWatchMovies'] = async ({ input }) => {
  requireAuth()

  const toWatchMovies = await db.toWatchMovie.findMany({
    where: { userId: context.currentUser.id },
    select: { movie: true },
    take: input.take,
    orderBy: { createdAt: 'desc' },
  })

  const movies = toWatchMovies.map((fm) => fm.movie)

  return movies.map((m) => ({
    ...m,
    posterUrl: `http://image.tmdb.org/t/p/w185${m.tmdbPosterPath}`,
    rating: m.rating.toNumber(),
  }))
}

export const createToWatchMovie: MutationResolvers['createToWatchMovie'] = async ({ input }) => {
  requireAuth()

  await validateWith(async () => {
    const watchedMovieCount = await db.watchedMovie.count({
      where: { ...input, userId: context.currentUser.id },
    })

    if (watchedMovieCount === 1) {
      throw new Error('Unable to add a watched movie to the watchlist')
    }
  })

  return db.toWatchMovie.create({
    data: { ...input, userId: context.currentUser.id },
  })
}

export const deleteToWatchMovie: MutationResolvers['deleteToWatchMovie'] = ({ movieId }) => {
  requireAuth()

  return db.toWatchMovie.delete({
    where: { movieId_userId: { movieId, userId: context.currentUser.id } },
  })
}
