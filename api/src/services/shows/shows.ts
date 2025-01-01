import { Prisma, Show as PrismaShow } from '@prisma/client'
import type { QueryResolvers } from 'types/graphql'

import { cache } from 'src/lib/cache'
import { db } from 'src/lib/db'
import { getTMDBShow, getTMDBShowSeason, searchTMDBShows, TMDBSearchShow } from 'src/lib/tmdb'

export const shows: QueryResolvers['shows'] = async ({ title }) => {
  const tmdbShows: TMDBSearchShow[] = await cache(['tmdbShows', title], () => searchTMDBShows({ title }), {
    expires: 60 * 60 * 24 * 7,
  })

  return tmdbShows.map((tmdbShow) => ({
    tmdbId: tmdbShow.id,
    overview: tmdbShow.overview,
    posterUrl: `http://image.tmdb.org/t/p/w154${tmdbShow.poster_path}`,
    releaseYear: Number(tmdbShow.first_air_date.split('-')[0]),
    title: tmdbShow.name,
  }))
}

type CachedPrismaShow = Omit<PrismaShow, 'createdAt' | 'updatedAt' | 'rating'> & {
  rating: string
  createdAt: string
  updatedAt: string
}

export const show: QueryResolvers['show'] = async ({ tmdbId }) => {
  let s: PrismaShow | CachedPrismaShow = await cache(
    ['show', tmdbId.toString()],
    () => db.show.findUnique({ where: { tmdbId }, include: { seasons: true } }),
    { expires: 60 * 60 * 24 * 31 }
  )

  if (!s) {
    const tmdbShow = await getTMDBShow(tmdbId)
    const seasons = await Promise.all(
      tmdbShow.seasons.filter((s) => s.season_number !== 0).map((s) => getTMDBShowSeason(tmdbId, s.season_number))
    )

    s = await db.show.create({
      data: {
        creators: tmdbShow.created_by.map((person) => person.name),
        genres: tmdbShow.genres.map((genre) => genre.name),
        imdbId: tmdbShow.external_ids.imdb_id,
        originalLanguage: tmdbShow.original_language,
        originalTitle: tmdbShow.original_name,
        overview: tmdbShow.overview,
        rating: Math.round(tmdbShow.vote_average * 10) / 10,
        tagline: tmdbShow.tagline || undefined,
        title: tmdbShow.name,
        tmdbBackdropPath: tmdbShow.backdrop_path,
        tmdbId: tmdbShow.id,
        tmdbPosterPath: tmdbShow.poster_path,
        seasons: {
          create: seasons.map((s) => ({
            airDate: new Date(s.air_date),
            number: s.season_number,
            overview: s.overview,
            rating: Math.round(s.vote_average * 10) / 10,
            tmdbPosterPath: s.poster_path,
            episodes: {
              create: s.episodes.map((e) => ({
                airDate: new Date(e.air_date),
                number: e.episode_number,
                overview: e.overview,
                rating: Math.round(e.vote_average * 10) / 10,
                runtime: e.runtime,
                title: e.name,
                tmdbStillPath: e.still_path,
              })),
            },
          })),
        },
      },
    })
  }

  return {
    ...s,
    backdropUrl: `http://image.tmdb.org/t/p/w1280${s.tmdbBackdropPath}`,
    posterUrl: `http://image.tmdb.org/t/p/w342${s.tmdbPosterPath}`,
    rating: new Prisma.Decimal(s.rating),
  }
}
