import { renderHook, waitFor } from '@redwoodjs/testing/web'

import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns the default value', () => {
    const defaultValue = { a: false, b: false }

    const { result } = renderHook(() => useLocalStorage('testObject', defaultValue))

    expect(result.current[0]).toEqual(defaultValue)
  })

  it('returns the value stored in the local storage', () => {
    const key = 'testObject'
    const localStorageValue = { a: true, b: true }

    localStorage.setItem(key, JSON.stringify(localStorageValue))

    const { result } = renderHook(() => useLocalStorage(key, { a: false, b: false }))

    expect(result.current[0]).toEqual(localStorageValue)
  })

  it('sets a new value', async () => {
    const defaultValue = 'before'
    const newValue = 'after'

    const { result } = renderHook(() => useLocalStorage('testString', defaultValue))

    expect(result.current[0]).toBe(defaultValue)
    await waitFor(() => result.current[1](newValue))
    expect(result.current[0]).toBe(newValue)
  })
})
