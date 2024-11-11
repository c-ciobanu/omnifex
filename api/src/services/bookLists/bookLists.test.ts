import { DefaultBookLists } from 'common'

import { ServiceValidationError } from '@redwoodjs/api'
import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import {
  bookLists,
  createBookList,
  updateBookList,
  deleteBookList,
  bookListItems,
  createBookListItem,
  deleteBookListItem,
} from './bookLists'
import type { StandardScenario } from './bookLists.scenarios'

describe('bookLists', () => {
  scenario('returns all bookLists', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await bookLists()

    expect(result.length).toEqual(2)
  })

  scenario('creates a bookList', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await createBookList({ input: { name: 'String' } })

    expect(result.name).toEqual('String')
  })

  scenario('updates a bookList', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const original = await db.bookList.findUnique({ where: { id: scenario.bookList.one.id } })
    const result = await updateBookList({ id: original.id, input: { name: 'String2' } })

    expect(result.name).toEqual('String2')
  })

  scenario('deletes a bookList', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const original = await deleteBookList({ id: scenario.bookList.one.id })
    const result = await db.bookList.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })
})

describe('bookListItems', () => {
  scenario('returns all bookListItems', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const result = await bookListItems({ listId: scenario.bookList.one.id })

    expect(result.length).toEqual(1)
  })

  scenario('does not allow a logged out user to create a book list item', async () => {
    mockCurrentUser(null)

    expect(() => createBookListItem({ input: { bookId: 1, listName: DefaultBookLists.ReadingList } })).rejects.toThrow(
      AuthenticationError
    )
  })

  scenario('does not allow a logged out user to delete a book list item', async () => {
    mockCurrentUser(null)

    expect(() => deleteBookListItem({ bookId: 1, listName: DefaultBookLists.ReadingList })).rejects.toThrow(
      AuthenticationError
    )
  })

  scenario('deletes a book list item', async (scenario: StandardScenario) => {
    mockCurrentUser(scenario.user.john)
    const original = await deleteBookListItem({
      bookId: scenario.bookListItem.one.bookId,
      listName: DefaultBookLists.ReadingList,
    })
    const result = await db.bookListItem.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  describe(DefaultBookLists.Read, () => {
    scenario('adds a book to the Read list', async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.john)
      const result = await createBookListItem({
        input: { bookId: scenario.book.theWinners.id, listName: DefaultBookLists.Read },
      })

      expect(result.bookId).toEqual(scenario.book.theWinners.id)

      const listItems = await bookListItems({ listId: result.listId })

      expect(listItems.length).toEqual(2)
    })

    scenario(
      'adds a book to the Read list and removes it from the Reading List list',
      async (scenario: StandardScenario) => {
        mockCurrentUser(scenario.user.john)

        const bookListItemCount = () => db.bookListItem.count({ where: { id: scenario.bookListItem.one.id } })

        expect(bookListItemCount()).resolves.toBe(1)

        await createBookListItem({
          input: { bookId: scenario.bookListItem.one.bookId, listName: DefaultBookLists.Read },
        })

        expect(bookListItemCount()).resolves.toBe(0)
      }
    )
  })

  describe(DefaultBookLists.ReadingList, () => {
    scenario('adds a book to the Reading List list', async (scenario: StandardScenario) => {
      mockCurrentUser(scenario.user.john)
      const result = await createBookListItem({
        input: { bookId: scenario.book.theWinners.id, listName: DefaultBookLists.ReadingList },
      })

      expect(result.bookId).toEqual(scenario.book.theWinners.id)

      const listItems = await bookListItems({ listId: result.listId })

      expect(listItems.length).toEqual(2)
    })

    scenario(
      "does not add a book to the user's reading list if the book is read",
      async (scenario: StandardScenario) => {
        mockCurrentUser(scenario.user.john)

        expect(() =>
          createBookListItem({
            input: { bookId: scenario.book.nonaTheNinth.id, listName: DefaultBookLists.ReadingList },
          })
        ).rejects.toThrow(ServiceValidationError)
      }
    )
  })
})
