import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const favoriteMovies: QueryResolvers['favoriteMovies'] = async ({ input }) => {
  requireAuth()

  const favoritedMovies = await db.favoritedMovie.findMany({
    where: { userId: context.currentUser.id },
    select: { movie: true },
    take: input.take,
    orderBy: { createdAt: 'desc' },
  })

  const movies = favoritedMovies.map((fm) => fm.movie)

  return movies.map((m) => ({
    ...m,
    posterUrl: `http://image.tmdb.org/t/p/w342${m.tmdbPosterPath}`,
    rating: m.rating.toNumber(),
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
