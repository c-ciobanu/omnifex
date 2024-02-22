import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { createFavoritedMovie, deleteFavoritedMovie } from './favoritedMovies'
import type { StandardScenario } from './favoritedMovies.scenarios'

describe('favoritedMovies', () => {
  scenario('creates a favorited movie', async (scenario: StandardScenario) => {
    mockCurrentUser({ id: scenario.favoritedMovie.two.userId })
    const result = await createFavoritedMovie({ input: { tmdbId: 4985314 } })

    expect(result.tmdbId).toEqual(4985314)
    expect(result.userId).toEqual(scenario.favoritedMovie.two.userId)
  })

  scenario('does not allow a logged out user to create a favorited movie', async () => {
    mockCurrentUser(null)

    expect(() => createFavoritedMovie({ input: { tmdbId: 4985314 } })).toThrow(AuthenticationError)
  })

  scenario('deletes a favorited movie', async (scenario: StandardScenario) => {
    mockCurrentUser({ id: scenario.favoritedMovie.one.userId })
    const original = await deleteFavoritedMovie({ tmdbId: scenario.favoritedMovie.one.tmdbId })
    const result = await db.favoritedMovie.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  scenario('does not allow a logged out user to delete a favorited movie', async (scenario: StandardScenario) => {
    mockCurrentUser(null)

    expect(() => deleteFavoritedMovie({ tmdbId: scenario.favoritedMovie.one.tmdbId })).toThrow(AuthenticationError)
  })
})
