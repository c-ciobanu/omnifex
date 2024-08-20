import { Prisma } from '@prisma/client'
import { Movie as PrismaMovie } from '@prisma/client'
import type { MovieRelationResolvers, QueryResolvers } from 'types/graphql'

import { cache } from 'src/lib/cache'
import { db } from 'src/lib/db'
import { searchTMDBMovies, getTMDBMovie, TMDBSearchMovie } from 'src/lib/tmdb'

export const movies: QueryResolvers['movies'] = async ({ title }) => {
  const tmdbMovies: TMDBSearchMovie[] = await cache(['tmdbMovies', title], () => searchTMDBMovies({ title }), {
    expires: 60 * 60 * 24 * 7,
  })

  return tmdbMovies.map((tmdbMovie) => ({
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
    releaseDate: new Date(m.releaseDate),
    posterUrl: `http://image.tmdb.org/t/p/w342${m.tmdbPosterPath}`,
    rating: new Prisma.Decimal(m.rating),
  }
}

export const Movie: MovieRelationResolvers = {
  userInfo: async (_obj, { root }) => {
    if (context.currentUser) {
      const favoritedMovieCount = await db.favoritedMovie.count({
        where: { movieId: root.id, userId: context.currentUser.id },
      })
      const watchedMovieCount = await db.watchedMovie.count({
        where: { movieId: root.id, userId: context.currentUser.id },
      })
      const toWatchMovieCount = await db.toWatchMovie.count({
        where: { movieId: root.id, userId: context.currentUser.id },
      })

      return {
        favorited: favoritedMovieCount === 1,
        watched: watchedMovieCount === 1,
        inWatchlist: toWatchMovieCount === 1,
      }
    }

    return null
  },
}
