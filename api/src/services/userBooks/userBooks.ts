import { QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'

import { favoritedBooks } from '../favoritedBooks/favoritedBooks'
import { readBooks } from '../readBooks/readBooks'
import { toReadBooks } from '../toReadBooks/toReadBooks'

export const userBooks: QueryResolvers['userBooks'] = ({ type }) => {
  requireAuth()

  if (type === 'FAVORITED') {
    return favoritedBooks()
  } else if (type === 'READ') {
    return readBooks()
  } else {
    return toReadBooks()
  }
}
