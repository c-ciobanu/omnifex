import type { MovieDetailsRelationResolvers, QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'
import { searchTMDBMovies, getTMDBMovie } from 'src/lib/tmdb'

export const movies: QueryResolvers['movies'] = async ({ title }) => {
  const tmdbMovies = await searchTMDBMovies({ title })

  return tmdbMovies.map((tmdbMovie) => ({
    tmdbId: tmdbMovie.id,
    overview: tmdbMovie.overview,
    posterUrl: `http://image.tmdb.org/t/p/w92${tmdbMovie.poster_path}`,
    releaseYear: Number(tmdbMovie.release_date.split('-')[0]),
    title: tmdbMovie.title,
  }))
}

export const movie: QueryResolvers['movie'] = async ({ tmdbId }) => {
  let m = await db.movie.findUnique({ where: { tmdbId } })

  if (!m) {
    const tmdbMovie = await getTMDBMovie(tmdbId)

    m = await db.movie.create({
      data: {
        genres: tmdbMovie.genres.map((genre) => genre.name),
        imdbId: tmdbMovie.imdb_id,
        overview: tmdbMovie.overview,
        rating: Math.round(tmdbMovie.vote_average * 10) / 10,
        releaseDate: new Date(tmdbMovie.release_date),
        runtime: tmdbMovie.runtime,
        tagline: tmdbMovie.tagline,
        title: tmdbMovie.title,
        tmdbId: tmdbMovie.id,
        tmdbPosterPath: tmdbMovie.poster_path,
      },
    })
  }

  return {
    ...m,
    posterUrl: `http://image.tmdb.org/t/p/w342${m.tmdbPosterPath}`,
    rating: m.rating.toNumber(),
  }
}

export const MovieDetails: MovieDetailsRelationResolvers = {
  userInteractions: async (_obj, { root }) => {
    if (context.currentUser) {
      const favoritedMovieCount = await db.favoritedMovie.count({
        where: { movieId: root.id, userId: context.currentUser.id },
      })
      const watchedMovieCount = await db.watchedMovie.count({
        where: { movieId: root.id, userId: context.currentUser.id },
      })
      const watchlistItemMovieCount = await db.watchlistItemMovie.count({
        where: { movieId: root.id, userId: context.currentUser.id },
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
