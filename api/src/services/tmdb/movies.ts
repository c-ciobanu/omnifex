import { fetch } from '@whatwg-node/fetch'
import type { DetailedMovieRelationResolvers, QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

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

export const movies: QueryResolvers['movies'] = async ({ title }) => {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${title}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
    },
  })
  const json: { results: TMDBMovie[] } = await response.json()

  return json.results.map((result) => ({
    id: result.id,
    overview: result.overview,
    posterUrl: `http://image.tmdb.org/t/p/w92${result.poster_path}`,
    releaseYear: Number(result.release_date.split('-')[0]),
    title: result.title,
  }))
}

export const movie: QueryResolvers['movie'] = async ({ tmdbId }) => {
  let m = await db.movie.findUnique({ where: { tmdbId } })

  if (!m) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
      },
    })
    const json: TMDBMovie = await response.json()

    m = await db.movie.create({
      data: {
        genres: json.genres.map((genre) => genre.name),
        imdbId: json.imdb_id,
        overview: json.overview,
        rating: Math.round(json.vote_average * 10) / 10,
        releaseDate: new Date(json.release_date),
        runtime: json.runtime,
        tagline: json.tagline,
        title: json.title,
        tmdbId: json.id,
        tmdbPosterPath: json.poster_path,
      },
    })
  }

  return {
    ...m,
    posterUrl: `http://image.tmdb.org/t/p/w342${m.tmdbPosterPath}`,
    rating: m.rating.toNumber(),
  }
}

export const DetailedMovie: DetailedMovieRelationResolvers = {
  user: async (_obj, { root }) => {
    if (context.currentUser) {
      const favoritedMovieCount = await db.favoritedMovie.count({
        where: { tmdbId: root.tmdbId, userId: context.currentUser.id },
      })
      const watchedMovieCount = await db.watchedMovie.count({
        where: { tmdbId: root.tmdbId, userId: context.currentUser.id },
      })
      const watchlistItemMovieCount = await db.watchlistItemMovie.count({
        where: { tmdbId: root.tmdbId, userId: context.currentUser.id },
      })

      return {
        favorited: favoritedMovieCount === 1,
        watched: watchedMovieCount === 1,
        watchlisted: watchlistItemMovieCount === 1,
      }
    }

    return null
  },
}
