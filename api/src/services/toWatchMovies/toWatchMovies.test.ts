import { ServiceValidationError } from '@redwoodjs/api'
import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { createToWatchMovie, deleteToWatchMovie } from './toWatchMovies'
import type { StandardScenario } from './toWatchMovies.scenarios'

describeScenario<StandardScenario>('toWatchMovies', (getScenario) => {
  let scenario: StandardScenario

  beforeEach(() => {
    scenario = getScenario()
  })

  it("adds a movie to the user's watchlist", async () => {
    mockCurrentUser({ id: scenario.user.john.id })
    const result = await createToWatchMovie({ input: { movieId: scenario.movie.parasite.id } })

    expect(result.movieId).toEqual(scenario.movie.parasite.id)
    expect(result.userId).toEqual(scenario.user.john.id)
  })

  it('does not allow a logged out user to add a movie to a watchlist', async () => {
    mockCurrentUser(null)

    await expect(async () => await createToWatchMovie({ input: { movieId: 1 } })).rejects.toThrow(AuthenticationError)
  })

  it("does not add a movie to the user's watchlist if the movie is watched", async () => {
    mockCurrentUser({ id: scenario.user.john.id })

    await expect(
      async () => await createToWatchMovie({ input: { movieId: scenario.watchedMovie.one.movieId } })
    ).rejects.toThrow(ServiceValidationError)
  })

  it("removes a movie from the user's watchlist", async () => {
    mockCurrentUser({ id: scenario.user.john.id })
    const original = await deleteToWatchMovie({ movieId: scenario.toWatchMovie.one.movieId })
    const result = await db.toWatchMovie.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  it('does not allow a logged out user to remove a movie from a watchlist', async () => {
    mockCurrentUser(null)

    await expect(async () => await deleteToWatchMovie({ movieId: 1 })).rejects.toThrow(AuthenticationError)
  })
})
