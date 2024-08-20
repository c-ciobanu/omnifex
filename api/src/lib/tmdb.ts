import { fetch } from '@whatwg-node/fetch'

export interface TMDBSearchMovie {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface TMDBMovie {
  adult: boolean
  backdrop_path: string
  budget: number
  genres: { id: number; name: string }[]
  homepage: string
  id: number
  imdb_id: string
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  production_companies: { id: number; logo_path: string; name: string; origin_country: string }[]
  production_countries: { iso_3166_1: string; name: string }[]
  release_date: string
  revenue: number
  runtime: number
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[]
  status: string
  tagline: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface TMDBMovieCredits {
  cast: Record<string, unknown>[]
  crew: {
    adult: boolean
    gender: number
    id: number
    known_for_department: string
    name: string
    original_name: string
    popularity: number
    profile_path: string
    credit_id: string
    department: string
    job: string
  }[]
  id: number
}

export const searchTMDBMovies = async ({ title }: { title: string }) => {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${title}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
    },
  })
  const json: { results: TMDBSearchMovie[] } = await response.json()

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

export const getTMDBMovieDirector = async (tmdbId: number) => {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}/credits`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
    },
  })
  const json: TMDBMovieCredits = await response.json()

  const director = json.crew.find((el) => el.job === 'Director')

  return director.name
}
