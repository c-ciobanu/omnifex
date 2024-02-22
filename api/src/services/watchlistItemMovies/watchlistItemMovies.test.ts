import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { createWatchlistItemMovie, deleteWatchlistItemMovie } from './watchlistItemMovies'
import type { StandardScenario } from './watchlistItemMovies.scenarios'

describe('watchlistItemMovies', () => {
  scenario("adds a movie to the user's watchlist", async (scenario: StandardScenario) => {
    mockCurrentUser({ id: scenario.watchlistItemMovie.two.userId })
    const result = await createWatchlistItemMovie({ input: { tmdbId: 4985314 } })

    expect(result.tmdbId).toEqual(4985314)
    expect(result.userId).toEqual(scenario.watchlistItemMovie.two.userId)
  })

  scenario('does not allow a logged out user to add a movie to a watchlist', async () => {
    mockCurrentUser(null)

    expect(() => createWatchlistItemMovie({ input: { tmdbId: 4985314 } })).toThrow(AuthenticationError)
  })

  scenario("removes a movie from the user's watchlist", async (scenario: StandardScenario) => {
    mockCurrentUser({ id: scenario.watchlistItemMovie.one.userId })
    const original = await deleteWatchlistItemMovie({ tmdbId: scenario.watchlistItemMovie.one.tmdbId })
    const result = await db.watchlistItemMovie.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  scenario(
    'does not allow a logged out user to remove a movie from a watchlist',
    async (scenario: StandardScenario) => {
      mockCurrentUser(null)

      expect(() => deleteWatchlistItemMovie({ tmdbId: scenario.watchlistItemMovie.one.tmdbId })).toThrow(
        AuthenticationError
      )
    }
  )
})
