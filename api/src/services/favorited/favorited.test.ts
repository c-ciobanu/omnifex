import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { createFavorited, deleteFavorited } from './favorited'
import type { StandardScenario } from './favorited.scenarios'

describe('favorited', () => {
  scenario('creates a favorited', async (scenario: StandardScenario) => {
    mockCurrentUser({ id: scenario.favorited.two.userId })
    const result = await createFavorited({ input: { tmdbId: 4985314 } })

    expect(result.tmdbId).toEqual(4985314)
    expect(result.userId).toEqual(scenario.favorited.two.userId)
  })

  scenario('does not allow a logged out user to create a favorited', async () => {
    mockCurrentUser(null)

    expect(() => createFavorited({ input: { tmdbId: 4985314 } })).toThrow(AuthenticationError)
  })

  scenario('deletes a favorited', async (scenario: StandardScenario) => {
    mockCurrentUser({ id: scenario.favorited.one.userId })
    const original = await deleteFavorited({ tmdbId: scenario.favorited.one.tmdbId })
    const result = await db.favorited.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  scenario('does not allow a logged out user to delete a favorited', async (scenario: StandardScenario) => {
    mockCurrentUser(null)

    expect(() => deleteFavorited({ tmdbId: scenario.favorited.one.tmdbId })).toThrow(AuthenticationError)
  })
})
