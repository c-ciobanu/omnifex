import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { createFavoritedMovie, deleteFavoritedMovie } from './favoritedMovies'
import type { StandardScenario } from './favoritedMovies.scenarios'

describe('favoritedMovies', () => {
  scenario('creates a favorited movie', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await createFavoritedMovie({ input: { movieId: scenario.movie.se7en.id } })

    expect(result.movieId).toEqual(scenario.movie.se7en.id)
    expect(result.userId).toEqual(scenario.user.john.id)
  })

  scenario('does not allow a logged out user to create a favorited movie', async () => {
    mockCurrentUser(null)

    expect(() => createFavoritedMovie({ input: { movieId: 1 } })).toThrow(AuthenticationError)
  })

  scenario('deletes a favorited movie', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const original = await deleteFavoritedMovie({ movieId: scenario.favoritedMovie.one.movieId })
    const result = await db.favoritedMovie.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  scenario('does not allow a logged out user to delete a favorited movie', async () => {
    mockCurrentUser(null)

    expect(() => deleteFavoritedMovie({ movieId: 1 })).toThrow(AuthenticationError)
  })
})
