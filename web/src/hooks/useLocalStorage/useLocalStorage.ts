import { useState, useEffect, Dispatch, SetStateAction } from 'react'

const getLocalStorageValue = <T>(key: string, defaultValue: T): T => {
  const savedLocalStorageValue = localStorage.getItem(key)
  const value = JSON.parse(savedLocalStorageValue)

  return value || defaultValue
}

export const useLocalStorage = <T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState(() => getLocalStorageValue(key, defaultValue))

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [value])

  return [value, setValue]
}
