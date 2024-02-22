import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { createWatchedMovie, deleteWatchedMovie } from './watchedMovies'
import type { StandardScenario } from './watchedMovies.scenarios'

describe('watchedMovies', () => {
  scenario('creates a watched movie', async (scenario: StandardScenario) => {
    mockCurrentUser({ id: scenario.watchedMovie.two.userId })
    const result = await createWatchedMovie({ input: { tmdbId: 4985314 } })

    expect(result.tmdbId).toEqual(4985314)
    expect(result.userId).toEqual(scenario.watchedMovie.two.userId)
  })

  scenario('does not allow a logged out user to create a watched movie', async () => {
    mockCurrentUser(null)

    expect(() => createWatchedMovie({ input: { tmdbId: 4985314 } })).toThrow(AuthenticationError)
  })

  scenario('deletes a watched movie', async (scenario: StandardScenario) => {
    mockCurrentUser({ id: scenario.watchedMovie.one.userId })
    const original = await deleteWatchedMovie({ tmdbId: scenario.watchedMovie.one.tmdbId })
    const result = await db.watchedMovie.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  scenario('does not allow a logged out user to delete a watched movie', async (scenario: StandardScenario) => {
    mockCurrentUser(null)

    expect(() => deleteWatchedMovie({ tmdbId: scenario.watchedMovie.one.tmdbId })).toThrow(AuthenticationError)
  })
})
