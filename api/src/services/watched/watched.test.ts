import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { createWatched, deleteWatched } from './watched'
import type { StandardScenario } from './watched.scenarios'

describe('watched', () => {
  scenario('creates a watched', async (scenario: StandardScenario) => {
    mockCurrentUser({ id: scenario.watched.two.userId })
    const result = await createWatched({ input: { tmdbId: 4985314 } })

    expect(result.tmdbId).toEqual(4985314)
    expect(result.userId).toEqual(scenario.watched.two.userId)
  })

  scenario('does not allow a logged out user to create a watched', async () => {
    mockCurrentUser(null)

    expect(() => createWatched({ input: { tmdbId: 4985314 } })).toThrow(AuthenticationError)
  })

  scenario('deletes a watched', async (scenario: StandardScenario) => {
    mockCurrentUser({ id: scenario.watched.one.userId })
    const original = await deleteWatched({ tmdbId: scenario.watched.one.tmdbId })
    const result = await db.watched.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  scenario('does not allow a logged out user to delete a watched', async (scenario: StandardScenario) => {
    mockCurrentUser(null)

    expect(() => deleteWatched({ tmdbId: scenario.watched.one.tmdbId })).toThrow(AuthenticationError)
  })
})
