import { Prisma, Movie as PrismaMovie } from '@prisma/client'
import { DefaultMovieLists } from 'common'
import type { MovieRelationResolvers, QueryResolvers } from 'types/graphql'

import { cache } from 'src/lib/cache'
import { db } from 'src/lib/db'
import { getTMDBMovie, searchTMDBMovies, TMDBSearchMovie } from 'src/lib/tmdb'
import { userDefaultMovieLists } from 'src/services/movieLists/movieLists'

export const movies: QueryResolvers['movies'] = async ({ title }) => {
  const tmdbMovies: TMDBSearchMovie[] = await cache(['tmdbMovies', title], () => searchTMDBMovies({ title }), {
    expires: 60 * 60 * 24 * 7,
  })

  return tmdbMovies
    .filter((tmdbMovie) => tmdbMovie.release_date)
    .map((tmdbMovie) => ({
      tmdbId: tmdbMovie.id,
      overview: tmdbMovie.overview,
      posterUrl: `http://image.tmdb.org/t/p/w154${tmdbMovie.poster_path}`,
      releaseYear: Number(tmdbMovie.release_date.split('-')[0]),
      title: tmdbMovie.title,
    }))
}

type CachedPrismaMovie = Omit<PrismaMovie, 'releaseDate' | 'createdAt' | 'updatedAt' | 'rating'> & {
  rating: string
  releaseDate: string
  createdAt: string
  updatedAt: string
}

export const movie: QueryResolvers['movie'] = async ({ tmdbId }) => {
  let m: PrismaMovie | CachedPrismaMovie = await cache(
    ['movie', tmdbId.toString()],
    () => db.movie.findUnique({ where: { tmdbId } }),
    { expires: 60 * 60 * 24 * 31 }
  )

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
    releaseDate: new Date(m.releaseDate),
    posterUrl: `http://image.tmdb.org/t/p/w342${m.tmdbPosterPath}`,
    rating: new Prisma.Decimal(m.rating),
  }
}

export const Movie: MovieRelationResolvers = {
  userInfo: async (_obj, { root }) => {
    if (context.currentUser) {
      const userLists = await userDefaultMovieLists()

      const watchedMovieCount = await db.movieListItem.count({
        where: { movieId: root.id, listId: userLists[DefaultMovieLists.Watched].id },
      })
      const toWatchMovieCount = await db.movieListItem.count({
        where: { movieId: root.id, listId: userLists[DefaultMovieLists.Watchlist].id },
      })

      return { watched: watchedMovieCount === 1, inWatchlist: toWatchMovieCount === 1 }
    }

    return null
  },
}
