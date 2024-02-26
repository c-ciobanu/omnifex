import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { createWatchedMovie, deleteWatchedMovie } from './watchedMovies'
import type { StandardScenario } from './watchedMovies.scenarios'

describeScenario<StandardScenario>('watchedMovies', (getScenario) => {
  let scenario: StandardScenario

  beforeEach(() => {
    scenario = getScenario()
  })

  it('creates a watched movie', async () => {
    mockCurrentUser({ id: scenario.user.one.id })
    const result = await createWatchedMovie({ input: { tmdbId: 4985314 } })

    expect(result.tmdbId).toEqual(4985314)
    expect(result.userId).toEqual(scenario.user.one.id)
  })

  it("creates a watched movie and removes it from the user's watchlist", async () => {
    mockCurrentUser({ id: scenario.user.one.id })

    const watchlistItemMovieCount = () =>
      db.watchlistItemMovie.count({
        where: { tmdbId: scenario.watchlistItemMovie.one.tmdbId, userId: scenario.user.one.id },
      })

    await expect(watchlistItemMovieCount()).resolves.toBe(1)

    await createWatchedMovie({ input: { tmdbId: scenario.watchlistItemMovie.one.tmdbId } })

    await expect(watchlistItemMovieCount()).resolves.toBe(0)
  })

  it('does not allow a logged out user to create a watched movie', async () => {
    mockCurrentUser(null)

    await expect(async () => await createWatchedMovie({ input: { tmdbId: 4985314 } })).rejects.toThrow(
      AuthenticationError
    )
  })

  it('deletes a watched movie', async () => {
    mockCurrentUser({ id: scenario.user.one.id })
    const original = await deleteWatchedMovie({ tmdbId: scenario.watchedMovie.one.tmdbId })
    const result = await db.watchedMovie.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  it('does not allow a logged out user to delete a watched movie', async () => {
    mockCurrentUser(null)

    await expect(async () => await deleteWatchedMovie({ tmdbId: 4985314 })).rejects.toThrow(AuthenticationError)
  })
})
