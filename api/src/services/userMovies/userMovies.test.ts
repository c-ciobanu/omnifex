import { ServiceValidationError } from '@redwoodjs/api'
import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { createUserMovie, deleteUserMovie } from './userMovies'
import { FavoritedScenario, ToWatchScenario, WatchedScenario } from './userMovies.scenarios'

describeScenario<FavoritedScenario>('favorited', 'type FAVORITED', (getScenario) => {
  let scenario: FavoritedScenario

  beforeEach(() => {
    scenario = getScenario()
  })

  it('creates a favorited movie', async () => {
    mockCurrentUser(scenario.user.john)
    const result = await createUserMovie({ input: { movieId: scenario.movie.se7en.id, type: 'FAVORITED' } })

    expect(result.movieId).toEqual(scenario.movie.se7en.id)
    expect(result.userId).toEqual(scenario.user.john.id)
  })

  it('does not allow a logged out user to create a favorited movie', async () => {
    mockCurrentUser(null)

    expect(() => createUserMovie({ input: { movieId: 1, type: 'FAVORITED' } })).toThrow(AuthenticationError)
  })

  it('deletes a favorited movie', async () => {
    mockCurrentUser(scenario.user.john)
    const original = await deleteUserMovie({ movieId: scenario.favoritedMovie.one.movieId, type: 'FAVORITED' })
    const result = await db.favoritedMovie.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  it('does not allow a logged out user to delete a favorited movie', async () => {
    mockCurrentUser(null)

    expect(() => deleteUserMovie({ movieId: 1, type: 'FAVORITED' })).toThrow(AuthenticationError)
  })
})

describeScenario<WatchedScenario>('watched', 'type WATCHED', (getScenario) => {
  let scenario: WatchedScenario

  beforeEach(() => {
    scenario = getScenario()
  })

  it('creates a watched movie', async () => {
    mockCurrentUser(scenario.user.john)
    const result = await createUserMovie({ input: { movieId: scenario.movie.parasite.id, type: 'WATCHED' } })

    expect(result.movieId).toEqual(scenario.movie.parasite.id)
    expect(result.userId).toEqual(scenario.user.john.id)
  })

  it("creates a watched movie and removes it from the user's watchlist", async () => {
    mockCurrentUser(scenario.user.john)

    const toWatchMovieCount = () =>
      db.toWatchMovie.count({
        where: { movieId: scenario.toWatchMovie.one.movieId, userId: scenario.user.john.id },
      })

    await expect(toWatchMovieCount()).resolves.toBe(1)

    await createUserMovie({ input: { movieId: scenario.toWatchMovie.one.movieId, type: 'WATCHED' } })

    await expect(toWatchMovieCount()).resolves.toBe(0)
  })

  it('does not allow a logged out user to create a watched movie', async () => {
    mockCurrentUser(null)

    await expect(async () => await createUserMovie({ input: { movieId: 1, type: 'WATCHED' } })).rejects.toThrow(
      AuthenticationError
    )
  })

  it('deletes a watched movie', async () => {
    mockCurrentUser(scenario.user.john)
    const original = await deleteUserMovie({ movieId: scenario.watchedMovie.one.movieId, type: 'WATCHED' })
    const result = await db.watchedMovie.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  it('does not allow a logged out user to delete a watched movie', async () => {
    mockCurrentUser(null)

    await expect(async () => await deleteUserMovie({ movieId: 1, type: 'WATCHED' })).rejects.toThrow(
      AuthenticationError
    )
  })
})

describeScenario<ToWatchScenario>('toWatch', 'type TO_WATCH', (getScenario) => {
  let scenario: ToWatchScenario

  beforeEach(() => {
    scenario = getScenario()
  })

  it("adds a movie to the user's watchlist", async () => {
    mockCurrentUser(scenario.user.john)
    const result = await createUserMovie({ input: { movieId: scenario.movie.parasite.id, type: 'TO_WATCH' } })

    expect(result.movieId).toEqual(scenario.movie.parasite.id)
    expect(result.userId).toEqual(scenario.user.john.id)
  })

  it('does not allow a logged out user to add a movie to a watchlist', async () => {
    mockCurrentUser(null)

    await expect(async () => await createUserMovie({ input: { movieId: 1, type: 'TO_WATCH' } })).rejects.toThrow(
      AuthenticationError
    )
  })

  it("does not add a movie to the user's watchlist if the movie is watched", async () => {
    mockCurrentUser(scenario.user.john)

    await expect(
      async () => await createUserMovie({ input: { movieId: scenario.watchedMovie.one.movieId, type: 'TO_WATCH' } })
    ).rejects.toThrow(ServiceValidationError)
  })

  it("removes a movie from the user's watchlist", async () => {
    mockCurrentUser(scenario.user.john)
    const original = await deleteUserMovie({ movieId: scenario.toWatchMovie.one.movieId, type: 'TO_WATCH' })
    const result = await db.toWatchMovie.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  it('does not allow a logged out user to remove a movie from a watchlist', async () => {
    mockCurrentUser(null)

    await expect(async () => await deleteUserMovie({ movieId: 1, type: 'TO_WATCH' })).rejects.toThrow(
      AuthenticationError
    )
  })
})
