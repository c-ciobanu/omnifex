import { useLocalStorage } from 'src/hooks/useLocalStorage/useLocalStorage'

interface LocalMovies {
  favorited: number[]
  watched: number[]
}

export const useLocalMovies = () => {
  const defaultValue = { favorited: [], watched: [] }
  const [localMovies, setLocalMovies] = useLocalStorage<LocalMovies>('movies', defaultValue)

  const resetLocalMovies = () => setLocalMovies(defaultValue)

  return { localMovies, setLocalMovies, resetLocalMovies }
}
