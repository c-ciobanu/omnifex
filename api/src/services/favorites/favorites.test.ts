import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { createFavorite, deleteFavorite } from './favorites'
import type { StandardScenario } from './favorites.scenarios'

describe('favorites', () => {
  scenario('creates a favorite', async (scenario: StandardScenario) => {
    mockCurrentUser({ id: scenario.favorite.two.userId })
    const result = await createFavorite({ input: { tmdbId: 4985314 } })

    expect(result.tmdbId).toEqual(4985314)
    expect(result.userId).toEqual(scenario.favorite.two.userId)
  })

  scenario('does not allow a logged out user to create a favorite', async () => {
    mockCurrentUser(null)

    expect(() => createFavorite({ input: { tmdbId: 4985314 } })).toThrow(AuthenticationError)
  })

  scenario('deletes a favorite', async (scenario: StandardScenario) => {
    mockCurrentUser({ id: scenario.favorite.one.userId })
    const original = await deleteFavorite({ tmdbId: scenario.favorite.one.tmdbId })
    const result = await db.favorite.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  scenario('does not allow a logged out user to delete a favorite', async (scenario: StandardScenario) => {
    mockCurrentUser(null)

    expect(() => deleteFavorite({ tmdbId: scenario.favorite.one.tmdbId })).toThrow(AuthenticationError)
  })
})
