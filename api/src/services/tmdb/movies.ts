import { fetch } from '@whatwg-node/fetch'
import type { DetailedMovieRelationResolvers, QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const movies: QueryResolvers['movies'] = async ({ title }) => {
  const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${title}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
    },
  })
  const json = await response.json()

  return json.results.map((result) => ({
    id: result.id,
    overview: result.overview,
    posterUrl: `http://image.tmdb.org/t/p/w92${result.poster_path}`,
    releaseYear: Number(result.release_date.split('-')[0]),
    title: result.title,
  }))
}

export const movie: QueryResolvers['movie'] = async ({ id }) => {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
    },
  })
  const json = await response.json()

  return {
    genres: json.genres.map((genre) => genre.name),
    id: json.id,
    overview: json.overview,
    posterUrl: `http://image.tmdb.org/t/p/w342${json.poster_path}`,
    rating: Math.round(json.vote_average * 10) / 10,
    releaseYear: Number(json.release_date.split('-')[0]),
    runtime: json.runtime,
    tagline: json.tagline,
    title: json.title,
  }
}

export const DetailedMovie: DetailedMovieRelationResolvers = {
  user: async (_obj, { root }) => {
    if (context.currentUser) {
      const favoritedCount = await db.favorite.count({
        where: { tmdbId: root.id, userId: context.currentUser.id },
      })
      const watchedCount = await db.watched.count({
        where: { tmdbId: root.id, userId: context.currentUser.id },
      })

      return {
        favorited: favoritedCount === 1,
        watched: watchedCount === 1,
      }
    }

    return null
  },
}
