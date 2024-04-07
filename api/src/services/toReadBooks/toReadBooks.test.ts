import { ServiceValidationError } from '@redwoodjs/api'
import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { createToReadBook, deleteToReadBook } from './toReadBooks'
import type { StandardScenario } from './toReadBooks.scenarios'

describeScenario<StandardScenario>('toReadBooks', (getScenario) => {
  let scenario: StandardScenario

  beforeEach(() => {
    scenario = getScenario()
  })

  it("adds a book to the user's reading list", async () => {
    mockCurrentUser({ id: scenario.user.john.id })
    const result = await createToReadBook({ input: { bookId: scenario.book.theBerryPickers.id } })

    expect(result.bookId).toEqual(scenario.book.theBerryPickers.id)
    expect(result.userId).toEqual(scenario.user.john.id)
  })

  it('does not allow a logged out user to add a book to a reading list', async () => {
    mockCurrentUser(null)

    await expect(async () => await createToReadBook({ input: { bookId: 1 } })).rejects.toThrow(AuthenticationError)
  })

  it("does not add a book to the user's reading list if the book is read", async () => {
    mockCurrentUser({ id: scenario.user.john.id })

    await expect(
      async () => await createToReadBook({ input: { bookId: scenario.readBook.one.bookId } })
    ).rejects.toThrow(ServiceValidationError)
  })

  it("removes a book from the user's reading list", async () => {
    mockCurrentUser({ id: scenario.user.john.id })
    const original = await deleteToReadBook({ bookId: scenario.toReadBook.one.bookId })
    const result = await db.toReadBook.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  it('does not allow a logged out user to remove a book from a reading list', async () => {
    mockCurrentUser(null)

    await expect(async () => await deleteToReadBook({ bookId: 1 })).rejects.toThrow(AuthenticationError)
  })
})
