import { ServiceValidationError } from '@redwoodjs/api'
import { AuthenticationError } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

import { createUserBook, deleteUserBook } from './userBooks'
import { FavoritedScenario, ReadScenario, ToReadScenario } from './userBooks.scenarios'

describeScenario<FavoritedScenario>('favorited', 'type FAVORITED', (getScenario) => {
  let scenario: FavoritedScenario

  beforeEach(() => {
    scenario = getScenario()
  })

  it('creates a favorited book', async () => {
    mockCurrentUser(scenario.user.john)
    const result = await createUserBook({ input: { bookId: scenario.book.thePassenger.id, type: 'FAVORITED' } })

    expect(result.bookId).toEqual(scenario.book.thePassenger.id)
    expect(result.userId).toEqual(scenario.user.john.id)
  })

  it('does not allow a logged out user to create a favorited book', async () => {
    mockCurrentUser(null)

    expect(() => createUserBook({ input: { bookId: 1, type: 'FAVORITED' } })).toThrow(AuthenticationError)
  })

  it('deletes a favorited book', async () => {
    mockCurrentUser(scenario.user.john)
    const original = await deleteUserBook({ bookId: scenario.favoritedBook.one.bookId, type: 'FAVORITED' })
    const result = await db.favoritedBook.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  it('does not allow a logged out user to delete a favorited book', async () => {
    mockCurrentUser(null)

    expect(() => deleteUserBook({ bookId: 1, type: 'FAVORITED' })).toThrow(AuthenticationError)
  })
})

describeScenario<ReadScenario>('read', 'type READ', (getScenario) => {
  let scenario: ReadScenario

  beforeEach(() => {
    scenario = getScenario()
  })

  it('creates a read book', async () => {
    mockCurrentUser(scenario.user.john)
    const result = await createUserBook({ input: { bookId: scenario.book.theBerryPickers.id, type: 'READ' } })

    expect(result.bookId).toEqual(scenario.book.theBerryPickers.id)
    expect(result.userId).toEqual(scenario.user.john.id)
  })

  it("creates a read book and removes it from the user's reading list", async () => {
    mockCurrentUser(scenario.user.john)

    const toReadBookCount = () =>
      db.toReadBook.count({
        where: { bookId: scenario.toReadBook.one.bookId, userId: scenario.user.john.id },
      })

    await expect(toReadBookCount()).resolves.toBe(1)

    await createUserBook({ input: { bookId: scenario.toReadBook.one.bookId, type: 'READ' } })

    await expect(toReadBookCount()).resolves.toBe(0)
  })

  it('does not allow a logged out user to create a read book', async () => {
    mockCurrentUser(null)

    await expect(async () => await createUserBook({ input: { bookId: 1, type: 'READ' } })).rejects.toThrow(
      AuthenticationError
    )
  })

  it('deletes a read book', async () => {
    mockCurrentUser(scenario.user.john)
    const original = await deleteUserBook({ bookId: scenario.readBook.one.bookId, type: 'READ' })
    const result = await db.readBook.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  it('does not allow a logged out user to delete a read book', async () => {
    mockCurrentUser(null)

    await expect(async () => await deleteUserBook({ bookId: 1, type: 'READ' })).rejects.toThrow(AuthenticationError)
  })
})

describeScenario<ToReadScenario>('toRead', 'type TO_READ', (getScenario) => {
  let scenario: ToReadScenario

  beforeEach(() => {
    scenario = getScenario()
  })

  it("adds a book to the user's reading list", async () => {
    mockCurrentUser(scenario.user.john)
    const result = await createUserBook({ input: { bookId: scenario.book.theBerryPickers.id, type: 'TO_READ' } })

    expect(result.bookId).toEqual(scenario.book.theBerryPickers.id)
    expect(result.userId).toEqual(scenario.user.john.id)
  })

  it('does not allow a logged out user to add a book to a reading list', async () => {
    mockCurrentUser(null)

    await expect(async () => await createUserBook({ input: { bookId: 1, type: 'TO_READ' } })).rejects.toThrow(
      AuthenticationError
    )
  })

  it("does not add a book to the user's reading list if the book is read", async () => {
    mockCurrentUser(scenario.user.john)

    await expect(
      async () => await createUserBook({ input: { bookId: scenario.readBook.one.bookId, type: 'TO_READ' } })
    ).rejects.toThrow(ServiceValidationError)
  })

  it("removes a book from the user's reading list", async () => {
    mockCurrentUser(scenario.user.john)
    const original = await deleteUserBook({ bookId: scenario.toReadBook.one.bookId, type: 'TO_READ' })
    const result = await db.toReadBook.findUnique({ where: { id: original.id } })

    expect(result).toEqual(null)
  })

  it('does not allow a logged out user to remove a book from a reading list', async () => {
    mockCurrentUser(null)

    await expect(async () => await deleteUserBook({ bookId: 1, type: 'TO_READ' })).rejects.toThrow(AuthenticationError)
  })
})
