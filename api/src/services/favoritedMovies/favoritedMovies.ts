import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const favoriteMovies: QueryResolvers['favoriteMovies'] = async () => {
  requireAuth()

  const favoritedMovies = await db.favoritedMovie.findMany({
    where: { userId: context.currentUser.id },
    select: { movie: true },
    orderBy: { createdAt: 'desc' },
  })

  const movies = favoritedMovies.map((fm) => fm.movie)

  return movies.map((m) => ({
    ...m,
    posterUrl: `http://image.tmdb.org/t/p/w185${m.tmdbPosterPath}`,
  }))
}

export const createFavoritedMovie: MutationResolvers['createFavoritedMovie'] = ({ input }) => {
  requireAuth()

  return db.favoritedMovie.create({
    data: { ...input, userId: context.currentUser.id },
  })
}

export const deleteFavoritedMovie: MutationResolvers['deleteFavoritedMovie'] = ({ movieId }) => {
  requireAuth()

  return db.favoritedMovie.delete({
    where: { movieId_userId: { movieId, userId: context.currentUser.id } },
  })
}
