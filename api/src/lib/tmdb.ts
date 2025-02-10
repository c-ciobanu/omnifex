import { fetch } from '@whatwg-node/fetch'

interface SearchMovieResponse {
  page: number
  results: TMDBSearchMovie[]
  total_pages: number
  total_results: number
}

export interface TMDBSearchMovie {
  adult: boolean
  backdrop_path?: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path?: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface TMDBMovie {
  adult: boolean
  backdrop_path: string
  belongs_to_collection?: string
  budget: number
  genres: { id: number; name: string }[]
  homepage: string
  id: number
  imdb_id: string
  origin_country: string[]
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
  credits: {
    cast: {
      adult: boolean
      gender: number
      id: number
      known_for_department: string
      name: string
      original_name: string
      popularity: number
      profile_path?: string
      cast_id: number
      character: string
      credit_id: string
      order: number
    }[]
    crew: {
      adult: boolean
      gender: number
      id: number
      known_for_department: string
      name: string
      original_name: string
      popularity: number
      profile_path?: string
      credit_id: string
      department: string
      job: string
    }[]
  }
}

export const searchTMDBMovies = async ({ title }: { title: string }) => {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${title}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
    },
  })
  const json: SearchMovieResponse = await response.json()

  return json.results
}

export const getTMDBMovie = async (tmdbId: number) => {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?append_to_response=credits`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
    },
  })
  const json: TMDBMovie = await response.json()

  return json
}

interface SearchTvResponse {
  page: number
  results: TMDBSearchShow[]
  total_pages: number
  total_results: number
}

export interface TMDBSearchShow {
  adult: boolean
  backdrop_path?: string
  genre_ids: number[]
  id: number
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path?: string
  first_air_date: string
  name: string
  vote_average: number
  vote_count: number
}

export interface TMDBShow {
  adult: boolean
  backdrop_path?: string
  created_by: {
    id: number
    credit_id: string
    name: string
    original_name: string
    gender: number
    profile_path?: string
  }[]
  episode_run_time: number[]
  first_air_date: string
  genres: { id: number; name: string }[]
  homepage: string
  id: number
  in_production: boolean
  languages: string[]
  last_air_date: string
  last_episode_to_air: {
    id: number
    name: string
    overview: string
    vote_average: number
    vote_count: number
    air_date: string
    episode_number: number
    episode_type: string
    production_code: string
    runtime: number
    season_number: number
    show_id: number
    still_path?: string
  }
  name: string
  next_episode_to_air?: {
    id: number
    name: string
    overview: string
    vote_average: number
    vote_count: number
    air_date: string
    episode_number: number
    episode_type: string
    production_code: string
    runtime: number
    season_number: number
    show_id: number
    still_path?: string
  }
  networks: { id: number; logo_path: string; name: string; origin_country: string }[]
  number_of_episodes: number
  number_of_seasons: number
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string
  production_companies: { id: number; logo_path?: string; name: string; origin_country: string }[]
  production_countries: { iso_3166_1: string; name: string }[]
  seasons: {
    air_date: string
    episode_count: number
    id: number
    name: string
    overview: string
    poster_path?: string
    season_number: number
    vote_average: number
  }[]
  spoken_languages: { english_name: string; iso_639_1: string; name: string }[]
  status: string
  tagline: string
  type: string
  vote_average: number
  vote_count: number
  external_ids: {
    facebook_id: string
    freebase_id: string
    freebase_mid: string
    id: number
    imdb_id?: string
    instagram_id?: string
    tvdb_id: number
    tvrage_id: number
    twitter_id?: string
    wikidata_id: string
  }
}

interface TMDBShowSeason {
  _id: string
  air_date?: string
  episodes: {
    air_date?: string
    episode_number: number
    episode_type?: string
    id: number
    name: string
    overview: string
    production_code: string
    runtime?: number
    season_number: number
    show_id: number
    still_path?: string
    vote_average: number
    vote_count: number
    crew: {
      job: string
      department: string
      credit_id: string
      adult: boolean
      gender: number
      id: number
      known_for_department: string
      name: string
      original_name: string
      popularity: number
      profile_path?: string
    }[]
    guest_stars: {
      character: string
      credit_id: string
      order: number
      adult: boolean
      gender: number
      id: number
      known_for_department: string
      name: string
      original_name: string
      popularity: number
      profile_path?: string
    }[]
  }[]
  name: string
  overview: string
  id: number
  poster_path?: string
  season_number: number
  vote_average: number
}

export const searchTMDBShows = async ({ title }: { title: string }) => {
  const response = await fetch(`https://api.themoviedb.org/3/search/tv?query=${title}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
    },
  })
  const json: SearchTvResponse = await response.json()

  return json.results
}

export const getTMDBShow = async (tmdbId: number) => {
  const response = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?append_to_response=external_ids`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
    },
  })
  const json: TMDBShow = await response.json()

  return json
}

export const getTMDBShowSeason = async (tmdbId: number, season: number) => {
  const response = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/season/${season}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
    },
  })
  const json: TMDBShowSeason = await response.json()

  return json
}

export interface TVChangesResponse {
  results: { id: number; adult: boolean }[]
  page: number
  total_pages: number
  total_results: number
}

export const getTMDBShowChanges = async (page = 1, from: string, to: string) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/changes?page=${page}&start_date=${from}end_date=${to}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
      },
    }
  )
  const json: TVChangesResponse = await response.json()

  return json
}
