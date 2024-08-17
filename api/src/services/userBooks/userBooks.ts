import { MutationResolvers, QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'

import { createFavoritedBook, deleteFavoritedBook, favoritedBooks } from '../favoritedBooks/favoritedBooks'
import { createReadBook, deleteReadBook, readBooks } from '../readBooks/readBooks'
import { createToReadBook, deleteToReadBook, toReadBooks } from '../toReadBooks/toReadBooks'

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

export const createUserBook: MutationResolvers['createUserBook'] = ({ input: { bookId, type } }) => {
  requireAuth()

  if (type === 'FAVORITED') {
    return createFavoritedBook({ input: { bookId } })
  } else if (type === 'READ') {
    return createReadBook({ input: { bookId } })
  } else {
    return createToReadBook({ input: { bookId } })
  }
}

export const deleteUserBook: MutationResolvers['deleteUserBook'] = ({ bookId, type }) => {
  requireAuth()

  if (type === 'FAVORITED') {
    return deleteFavoritedBook({ bookId })
  } else if (type === 'READ') {
    return deleteReadBook({ bookId })
  } else {
    return deleteToReadBook({ bookId })
  }
}
