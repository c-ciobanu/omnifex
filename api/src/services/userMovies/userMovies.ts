import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'

import { createFavoritedMovie, deleteFavoritedMovie, favoriteMovies } from '../favoritedMovies/favoritedMovies'
import { createToWatchMovie, deleteToWatchMovie, toWatchMovies } from '../toWatchMovies/toWatchMovies'
import { createWatchedMovie, deleteWatchedMovie, watchedMovies } from '../watchedMovies/watchedMovies'

export const userMovies: QueryResolvers['userMovies'] = ({ type }) => {
  requireAuth()

  if (type === 'FAVORITED') {
    return favoriteMovies()
  } else if (type === 'WATCHED') {
    return watchedMovies()
  } else {
    return toWatchMovies()
  }
}

export const createUserMovie: MutationResolvers['createUserMovie'] = ({ input: { movieId, type } }) => {
  requireAuth()

  if (type === 'FAVORITED') {
    return createFavoritedMovie({ input: { movieId } })
  } else if (type === 'WATCHED') {
    return createWatchedMovie({ input: { movieId } })
  } else {
    return createToWatchMovie({ input: { movieId } })
  }
}

export const deleteUserMovie: MutationResolvers['deleteUserMovie'] = ({ movieId, type }) => {
  requireAuth()

  if (type === 'FAVORITED') {
    return deleteFavoritedMovie({ movieId })
  } else if (type === 'WATCHED') {
    return deleteWatchedMovie({ movieId })
  } else {
    return deleteToWatchMovie({ movieId })
  }
}
