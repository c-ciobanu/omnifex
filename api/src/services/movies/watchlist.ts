import { MovieListType } from '@prisma/client'
import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { validateWith } from '@redwoodjs/api'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import { isMovieWatched } from './watched'

export const isMovieInWatchlist = async (id: number) => {
  requireAuth()

  const count = await db.movieListItem.count({
    where: { list: { type: MovieListType.WATCHLIST, userId: context.currentUser.id }, movieId: id },
  })

  return count === 1
}

export const moviesWatchlist: QueryResolvers['moviesWatchlist'] = async () => {
  requireAuth()

  const movieListItems = await db.movieList
    .findFirst({ where: { type: MovieListType.WATCHLIST, userId: context.currentUser.id } })
    .movies({ select: { movie: true } })

  const movies = movieListItems.map((listItem) => listItem.movie)

  return movies.map((m) => ({
    ...m,
    posterUrl: `https://image.tmdb.org/t/p/w185${m.tmdbPosterPath}`,
  }))
}

export const watchlistMovie: MutationResolvers['watchlistMovie'] = async ({ id }) => {
  requireAuth()

  await validateWith(async () => {
    const watched = await isMovieWatched(id)

    if (watched) {
      throw new Error('Unable to add a watched movie to the watchlist.')
    }
  })

  const list = await db.movieList.findFirst({
    where: { userId: context.currentUser.id, type: MovieListType.WATCHLIST },
    select: { id: true },
  })

  return db.movieListItem.create({ data: { listId: list.id, movieId: id } })
}

export const unwatchlistMovie: MutationResolvers['unwatchlistMovie'] = async ({ id }) => {
  requireAuth()

  const list = await db.movieList.findFirst({
    where: { userId: context.currentUser.id, type: MovieListType.WATCHLIST },
    select: { id: true },
  })

  return db.movieListItem.delete({ where: { listId_movieId: { listId: list.id, movieId: id } } })
}
