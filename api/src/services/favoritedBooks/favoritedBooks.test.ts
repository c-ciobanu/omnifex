import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { createFavoritedBook, deleteFavoritedBook } from './favoritedBooks'
import type { StandardScenario } from './favoritedBooks.scenarios'

describe('favoritedBooks', () => {
  scenario('creates a favorited book', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await createFavoritedBook({ input: { bookId: scenario.book.thePassenger.id } })

    expect(result.bookId).toEqual(scenario.book.thePassenger.id)
    expect(result.userId).toEqual(scenario.user.john.id)
  })

  scenario('does not allow a logged out user to create a favorited book', async () => {
    mockCurrentUser(null)

    expect(() => createFavoritedBook({ input: { bookId: 1 } })).toThrow(AuthenticationError)
  })

  scenario('deletes a favorited book', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const original = await deleteFavoritedBook({ bookId: scenario.favoritedBook.one.bookId })
    const result = await db.favoritedBook.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  scenario('does not allow a logged out user to delete a favorited book', async () => {
    mockCurrentUser(null)

    expect(() => deleteFavoritedBook({ bookId: 1 })).toThrow(AuthenticationError)
  })
})
