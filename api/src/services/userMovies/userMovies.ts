import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { validateWith } from '@redwoodjs/api'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

const favoritedMovies = async () => {
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

const watchedMovies = async () => {
  const watchedMovies = await db.watchedMovie.findMany({
    where: { userId: context.currentUser.id },
    select: { movie: true },
    orderBy: { createdAt: 'desc' },
  })

  const movies = watchedMovies.map((fm) => fm.movie)

  return movies.map((m) => ({
    ...m,
    posterUrl: `http://image.tmdb.org/t/p/w185${m.tmdbPosterPath}`,
  }))
}

const toWatchMovies = async () => {
  const toWatchMovies = await db.toWatchMovie.findMany({
    where: { userId: context.currentUser.id },
    select: { movie: true },
    orderBy: { createdAt: 'desc' },
  })

  const movies = toWatchMovies.map((fm) => fm.movie)

  return movies.map((m) => ({
    ...m,
    posterUrl: `http://image.tmdb.org/t/p/w185${m.tmdbPosterPath}`,
  }))
}

export const userMovies: QueryResolvers['userMovies'] = ({ type }) => {
  requireAuth()

  if (type === 'FAVORITED') {
    return favoritedMovies()
  } else if (type === 'WATCHED') {
    return watchedMovies()
  } else {
    return toWatchMovies()
  }
}

const createMovieListItem = async (listName: string, movieId: number) => {
  const list = await db.movieList.findFirst({
    where: { userId: context.currentUser.id, name: listName },
    select: { id: true },
  })

  await db.movieListItem.create({ data: { movieId, listId: list.id } })
}

const createFavoritedMovie = async (movieId: number) => {
  await createMovieListItem('Favorites', movieId)

  return db.favoritedMovie.create({
    data: { movieId, userId: context.currentUser.id },
  })
}

const createWatchedMovie = async (movieId: number) => {
  const toWatchMovieCount = await db.toWatchMovie.count({
    where: { movieId, userId: context.currentUser.id },
  })

  if (toWatchMovieCount === 1) {
    await deleteMovieListItem('Watchlist', movieId)

    await deleteToWatchMovie(movieId)
  }

  await createMovieListItem('Watched', movieId)

  return db.watchedMovie.create({
    data: { movieId, userId: context.currentUser.id },
  })
}

const createToWatchMovie = async (movieId: number) => {
  await validateWith(async () => {
    const watchedMovieCount = await db.watchedMovie.count({
      where: { movieId, userId: context.currentUser.id },
    })

    if (watchedMovieCount === 1) {
      throw new Error('Unable to add a watched movie to the watchlist')
    }
  })

  await createMovieListItem('Watchlist', movieId)

  return db.toWatchMovie.create({
    data: { movieId, userId: context.currentUser.id },
  })
}

export const createUserMovie: MutationResolvers['createUserMovie'] = ({ input: { movieId, type } }) => {
  requireAuth()

  if (type === 'FAVORITED') {
    return createFavoritedMovie(movieId)
  } else if (type === 'WATCHED') {
    return createWatchedMovie(movieId)
  } else {
    return createToWatchMovie(movieId)
  }
}

const deleteMovieListItem = async (listName: string, movieId: number) => {
  const list = await db.movieList.findFirst({
    where: { userId: context.currentUser.id, name: listName },
    select: { id: true },
  })

  await db.movieListItem.deleteMany({ where: { movieId, listId: list.id } })
}

const deleteFavoritedMovie = async (movieId: number) => {
  await deleteMovieListItem('Favorites', movieId)

  return db.favoritedMovie.delete({
    where: { movieId_userId: { movieId, userId: context.currentUser.id } },
  })
}

const deleteWatchedMovie = async (movieId: number) => {
  await deleteMovieListItem('Watched', movieId)

  return db.watchedMovie.delete({
    where: { movieId_userId: { movieId, userId: context.currentUser.id } },
  })
}

const deleteToWatchMovie = async (movieId: number) => {
  await deleteMovieListItem('Watchlist', movieId)

  return db.toWatchMovie.delete({
    where: { movieId_userId: { movieId, userId: context.currentUser.id } },
  })
}

export const deleteUserMovie: MutationResolvers['deleteUserMovie'] = ({ movieId, type }) => {
  requireAuth()

  if (type === 'FAVORITED') {
    return deleteFavoritedMovie(movieId)
  } else if (type === 'WATCHED') {
    return deleteWatchedMovie(movieId)
  } else {
    return deleteToWatchMovie(movieId)
  }
}
