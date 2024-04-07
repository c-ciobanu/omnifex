import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { createReadBook, deleteReadBook } from './readBooks'
import type { StandardScenario } from './readBooks.scenarios'

describeScenario<StandardScenario>('readBooks', (getScenario) => {
  let scenario: StandardScenario

  beforeEach(() => {
    scenario = getScenario()
  })

  it('creates a read book', async () => {
    mockCurrentUser({ id: scenario.user.john.id })
    const result = await createReadBook({ input: { bookId: scenario.book.theBerryPickers.id } })

    expect(result.bookId).toEqual(scenario.book.theBerryPickers.id)
    expect(result.userId).toEqual(scenario.user.john.id)
  })

  it("creates a read book and removes it from the user's reading list", async () => {
    mockCurrentUser({ id: scenario.user.john.id })

    const toReadBookCount = () =>
      db.toReadBook.count({
        where: { bookId: scenario.toReadBook.one.bookId, userId: scenario.user.john.id },
      })

    await expect(toReadBookCount()).resolves.toBe(1)

    await createReadBook({ input: { bookId: scenario.toReadBook.one.bookId } })

    await expect(toReadBookCount()).resolves.toBe(0)
  })

  it('does not allow a logged out user to create a read book', async () => {
    mockCurrentUser(null)

    await expect(async () => await createReadBook({ input: { bookId: 1 } })).rejects.toThrow(AuthenticationError)
  })

  it('deletes a read book', async () => {
    mockCurrentUser({ id: scenario.user.john.id })
    const original = await deleteReadBook({ bookId: scenario.readBook.one.bookId })
    const result = await db.readBook.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  it('does not allow a logged out user to delete a read book', async () => {
    mockCurrentUser(null)

    await expect(async () => await deleteReadBook({ bookId: 1 })).rejects.toThrow(AuthenticationError)
  })
})
