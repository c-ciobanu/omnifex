import { ServiceValidationError } from '@redwoodjs/api'
import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { createWatchlistItemMovie, deleteWatchlistItemMovie } from './watchlistItemMovies'
import type { StandardScenario } from './watchlistItemMovies.scenarios'

describeScenario<StandardScenario>('watchlistItemMovies', (getScenario) => {
  let scenario: StandardScenario

  beforeEach(() => {
    scenario = getScenario()
  })

  it("adds a movie to the user's watchlist", async () => {
    mockCurrentUser({ id: scenario.user.one.id })
    const result = await createWatchlistItemMovie({ input: { tmdbId: 4985314 } })

    expect(result.tmdbId).toEqual(4985314)
    expect(result.userId).toEqual(scenario.user.one.id)
  })

  it('does not allow a logged out user to add a movie to a watchlist', async () => {
    mockCurrentUser(null)

    await expect(async () => await createWatchlistItemMovie({ input: { tmdbId: 4985314 } })).rejects.toThrow(
      AuthenticationError
    )
  })

  it("does not add a movie to the user's watchlist if the movie is watched", async () => {
    mockCurrentUser({ id: scenario.user.one.id })

    await expect(
      async () => await createWatchlistItemMovie({ input: { tmdbId: scenario.watchedMovie.one.tmdbId } })
    ).rejects.toThrow(ServiceValidationError)
  })

  it("removes a movie from the user's watchlist", async () => {
    mockCurrentUser({ id: scenario.user.one.id })
    const original = await deleteWatchlistItemMovie({ tmdbId: scenario.watchlistItemMovie.one.tmdbId })
    const result = await db.watchlistItemMovie.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  it('does not allow a logged out user to remove a movie from a watchlist', async () => {
    mockCurrentUser(null)

    await expect(async () => await deleteWatchlistItemMovie({ tmdbId: 4985314 })).rejects.toThrow(AuthenticationError)
  })
})
