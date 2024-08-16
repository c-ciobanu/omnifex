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

const createFavoritedMovie = (movieId: number) => {
  return db.favoritedMovie.create({
    data: { movieId, userId: context.currentUser.id },
  })
}

const createWatchedMovie = async (movieId: number) => {
  const toWatchMovieCount = await db.toWatchMovie.count({
    where: { movieId, userId: context.currentUser.id },
  })

  if (toWatchMovieCount === 1) {
    await deleteToWatchMovie(movieId)
  }

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

const deleteFavoritedMovie = (movieId: number) => {
  return db.favoritedMovie.delete({
    where: { movieId_userId: { movieId, userId: context.currentUser.id } },
  })
}

const deleteWatchedMovie = (movieId: number) => {
  return db.watchedMovie.delete({
    where: { movieId_userId: { movieId, userId: context.currentUser.id } },
  })
}

const deleteToWatchMovie = (movieId: number) => {
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
