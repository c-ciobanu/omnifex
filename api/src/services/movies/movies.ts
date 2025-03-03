import { MovieListType } from '@prisma/client'
import type { MovieRelationResolvers, QueryResolvers } from 'types/graphql'

import { cache } from 'src/lib/cache'
import { db } from 'src/lib/db'
import { getTMDBMovie, searchTMDBMovies, TMDBSearchMovie } from 'src/lib/tmdb'

export const movies: QueryResolvers['movies'] = async ({ title }) => {
  const tmdbMovies: TMDBSearchMovie[] = await cache(['tmdbMovies', title], () => searchTMDBMovies({ title }), {
    expires: 60 * 60 * 24 * 7,
  })

  return tmdbMovies
    .filter((tmdbMovie) => tmdbMovie.release_date)
    .map((tmdbMovie) => ({
      tmdbId: tmdbMovie.id,
      overview: tmdbMovie.overview,
      posterUrl: `https://image.tmdb.org/t/p/w154${tmdbMovie.poster_path}`,
      releaseYear: Number(tmdbMovie.release_date.split('-')[0]),
      title: tmdbMovie.title,
    }))
}

export const movie: QueryResolvers['movie'] = async ({ tmdbId }) => {
  let m = await db.movie.findUnique({ where: { tmdbId } })

  if (!m) {
    const tmdbMovie = await getTMDBMovie(tmdbId)
    const director = tmdbMovie.credits.crew.find((el) => el.job === 'Director')

    m = await db.movie.create({
      data: {
        director: director.name,
        genres: tmdbMovie.genres.map((genre) => genre.name),
        imdbId: tmdbMovie.imdb_id,
        originalLanguage: tmdbMovie.original_language,
        originalTitle: tmdbMovie.original_title,
        overview: tmdbMovie.overview,
        rating: Math.round(tmdbMovie.vote_average * 10) / 10,
        releaseDate: new Date(tmdbMovie.release_date),
        runtime: tmdbMovie.runtime,
        tagline: tmdbMovie.tagline || undefined,
        title: tmdbMovie.title,
        tmdbId: tmdbMovie.id,
        tmdbPosterPath: tmdbMovie.poster_path,
      },
    })
  }

  return {
    ...m,
    posterUrl: `https://image.tmdb.org/t/p/w342${m.tmdbPosterPath}`,
  }
}

export const Movie: MovieRelationResolvers = {
  userInfo: async (_obj, { root }) => {
    if (context.currentUser) {
      const movieListItems = await db.movieListItem.findMany({
        where: { list: { type: { not: MovieListType.CUSTOM }, userId: context.currentUser.id }, movieId: root.id },
        select: { list: { select: { type: true } } },
      })

      return {
        watched: movieListItems.some((item) => item.list.type === MovieListType.WATCHED),
        inWatchlist: movieListItems.some((item) => item.list.type === MovieListType.WATCHLIST),
      }
    }

    return null
  },
}
