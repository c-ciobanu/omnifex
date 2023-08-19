import { useLocalStorage } from 'src/hooks/useLocalStorage/useLocalStorage'

type LocalMovies = {
  favorited: number[]
  watched: number[]
}

export const useLocalMovies = () => {
  const [localMovies, setLocalMovies] = useLocalStorage<LocalMovies>('movies', { favorited: [], watched: [] })

  return { localMovies, setLocalMovies }
}
