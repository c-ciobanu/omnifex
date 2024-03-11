import { fetch } from '@whatwg-node/fetch'

interface TMDBMovie {
  genres: { id: number; name: string }[]
  id: number
  imdb_id: string
  overview: string
  poster_path: string
  release_date: string
  runtime: number
  tagline: string
  title: string
  vote_average: number
}

export const searchTMDBMovies = async ({ title }: { title: string }) => {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${title}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
    },
  })
  const json: { results: TMDBMovie[] } = await response.json()

  return json.results
}

export const getTMDBMovie = async (tmdbId: number) => {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
    },
  })
  const json: TMDBMovie = await response.json()

  return json
}
