import type { QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'

import { favoriteMovies } from '../favoritedMovies/favoritedMovies'
import { toWatchMovies } from '../toWatchMovies/toWatchMovies'
import { watchedMovies } from '../watchedMovies/watchedMovies'

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
