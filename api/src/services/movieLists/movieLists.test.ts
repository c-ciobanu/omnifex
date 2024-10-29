import { ServiceValidationError } from '@redwoodjs/api'
import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import {
  movieLists,
  createMovieList,
  updateMovieList,
  deleteMovieList,
  movieListItems,
  createMovieListItem,
  deleteMovieListItem,
} from './movieLists'
import type { StandardScenario } from './movieLists.scenarios'

describe('movieLists', () => {
  scenario('returns all movieLists', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await movieLists()

    expect(result.length).toEqual(2)
  })

  scenario('creates a movieList', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await createMovieList({ input: { name: 'String' } })

    expect(result.name).toEqual('String')
  })

  scenario('updates a movieList', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const original = await db.movieList.findUnique({ where: { id: scenario.movieList.one.id } })
    const result = await updateMovieList({ id: original.id, input: { name: 'String2' } })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a movieList', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const original = await deleteMovieList({ id: scenario.movieList.one.id })
    const result = await db.movieList.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })
})

describe('movieListItems', () => {
  scenario('returns all movieListItems', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await movieListItems({ listId: scenario.movieList.one.id })

    expect(result.length).toEqual(1)
  })

  scenario('does not allow a logged out user to create a movie list item', async () => {
    mockCurrentUser(null)

    expect(() => createMovieListItem({ input: { movieId: 1, listName: 'Watchlist' } })).rejects.toThrow(
      AuthenticationError
    )
  })

  scenario('does not allow a logged out user to delete a movie list item', async () => {
    mockCurrentUser(null)

    expect(() => deleteMovieListItem({ movieId: 1, listName: 'Watchlist' })).rejects.toThrow(AuthenticationError)
  })

  scenario('deletes a movie list item', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const original = await deleteMovieListItem({
      movieId: scenario.movieListItem.one.movieId,
      listName: 'Watchlist',
    })
    const result = await db.movieListItem.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  describe('Watched', () => {
    scenario('adds a movie to the Watched list', async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.john)
      const result = await createMovieListItem({ input: { movieId: scenario.movie.se7en.id, listName: 'Watched' } })

      expect(result.movieId).toEqual(scenario.movie.se7en.id)

      const listItems = await movieListItems({ listId: result.listId })

      expect(listItems.length).toEqual(2)
    })

    scenario(
      'adds a movie to the Watched list and removes it from the Watchlist list',
      async (scenario: StandardScenario) => {
        mockCurrentUser(scenario.user.john)

        const movieListItemCount = () => db.movieListItem.count({ where: { id: scenario.movieListItem.one.id } })

        expect(movieListItemCount()).resolves.toBe(1)

        await createMovieListItem({ input: { movieId: scenario.movieListItem.one.movieId, listName: 'Watched' } })

        expect(movieListItemCount()).resolves.toBe(0)
      }
    )
  })

  describe('Watchlist', () => {
    scenario('adds a movie to the Watchlist list', async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.john)
      const result = await createMovieListItem({ input: { movieId: scenario.movie.se7en.id, listName: 'Watchlist' } })

      expect(result.movieId).toEqual(scenario.movie.se7en.id)

      const listItems = await movieListItems({ listId: result.listId })

      expect(listItems.length).toEqual(2)
    })

    scenario(
      "does not add a movie to the user's watchlist if the movie is watched",
      async (scenario: StandardScenario) => {
        mockCurrentUser(scenario.user.john)

        expect(() =>
          createMovieListItem({ input: { movieId: scenario.movie.broker.id, listName: 'Watchlist' } })
        ).rejects.toThrow(ServiceValidationError)
      }
    )
  })
})
