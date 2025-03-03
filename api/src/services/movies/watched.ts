import { MovieListType } from '@prisma/client'
import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import { isMovieInWatchlist, unwatchlistMovie } from './watchlist'

export const isMovieWatched = async (id: number) => {
  requireAuth()

  const count = await db.movieListItem.count({
    where: { movieId: id, list: { type: MovieListType.WATCHLIST, userId: context.currentUser.id } },
  })

  return count === 1
}

export const watchedMovies: QueryResolvers['watchedMovies'] = async () => {
  requireAuth()

  const movieListItems = await db.movieList
    .findFirst({ where: { type: MovieListType.WATCHED, userId: context.currentUser.id } })
    .movies({ select: { movie: true } })

  const movies = movieListItems.map((listItem) => listItem.movie)

  return movies.map((m) => ({
    ...m,
    posterUrl: `https://image.tmdb.org/t/p/w185${m.tmdbPosterPath}`,
  }))
}

export const watchMovie: MutationResolvers['watchMovie'] = async ({ id }) => {
  requireAuth()

  const inWatchlist = await isMovieInWatchlist(id)

  if (inWatchlist) {
    await unwatchlistMovie({ id })
  }

  const list = await db.movieList.findFirst({
    where: { userId: context.currentUser.id, type: MovieListType.WATCHED },
    select: { id: true },
  })

  return db.movieListItem.create({ data: { listId: list.id, movieId: id } })
}

export const unwatchMovie: MutationResolvers['unwatchMovie'] = async ({ id }) => {
  requireAuth()

  const list = await db.movieList.findFirst({
    where: { userId: context.currentUser.id, type: MovieListType.WATCHED },
    select: { id: true },
  })

  return db.movieListItem.delete({ where: { listId_movieId: { listId: list.id, movieId: id } } })
}
