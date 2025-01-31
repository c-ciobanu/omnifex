import { Prisma, ShowEpisode as PrismaEpisode, ShowSeason as PrismaSeason, Show as PrismaShow } from '@prisma/client'
import type { QueryResolvers, SeasonRelationResolvers, ShowRelationResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { cache, cacheFindMany } from 'src/lib/cache'
import { db } from 'src/lib/db'
import { getTMDBShow, getTMDBShowSeason, searchTMDBShows, TMDBSearchShow } from 'src/lib/tmdb'

type CachedPrismaShow = Omit<PrismaShow, 'createdAt' | 'updatedAt' | 'rating'> & {
  rating: string
  createdAt: string
  updatedAt: string
}

type CachedPrismaSeason = Omit<PrismaSeason, 'createdAt' | 'updatedAt' | 'rating'> & {
  rating: string
  createdAt: string
  updatedAt: string
}

type CachedPrismaEpisode = Omit<PrismaEpisode, 'createdAt' | 'updatedAt' | 'rating'> & {
  rating: string
  createdAt: string
  updatedAt: string
}

export const getUserShowProgress = async (id: number) => {
  requireAuth()

  const { _count: counts } = await db.show.findUnique({
    where: { id },
    select: {
      _count: {
        select: {
          episodes: true,
          watchedEpisodes: { where: { userId: context.currentUser.id } },
          inWatchlist: { where: { userId: context.currentUser.id } },
          abandoned: { where: { userId: context.currentUser.id } },
        },
      },
    },
  })

  return {
    watched: counts.episodes === counts.watchedEpisodes,
    watchedEpisodes: counts.watchedEpisodes,
    watchedPercentage: Math.round((counts.watchedEpisodes / counts.episodes) * 100),
    inWatchlist: counts.inWatchlist === 1,
    abandoned: counts.abandoned === 1,
  }
}

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

export const show: QueryResolvers['show'] = async ({ tmdbId }) => {
  let s: PrismaShow | CachedPrismaShow = await cache(
    ['show', tmdbId.toString()],
    () => db.show.findUnique({ where: { tmdbId } }),
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
      },
    })

    const dbSeasons = await db.showSeason.createManyAndReturn({
      data: seasons.map((season) => ({
        airDate: new Date(season.air_date),
        number: season.season_number,
        overview: season.overview,
        rating: Math.round(season.vote_average * 10) / 10,
        tmdbPosterPath: season.poster_path,
        showId: s.id,
      })),
    })

    await db.showEpisode.createMany({
      data: dbSeasons.flatMap((dbSeason) => {
        const season = seasons.find((s) => s.season_number === dbSeason.number)

        return season.episodes.map((e) => ({
          airDate: new Date(e.air_date),
          number: e.episode_number,
          overview: e.overview,
          rating: Math.round(e.vote_average * 10) / 10,
          runtime: e.runtime,
          title: e.name,
          tmdbStillPath: e.still_path,
          seasonId: dbSeason.id,
          showId: s.id,
        }))
      }),
    })
  }

  return {
    ...s,
    backdropUrl: `http://image.tmdb.org/t/p/w1280${s.tmdbBackdropPath}`,
    posterUrl: `http://image.tmdb.org/t/p/w342${s.tmdbPosterPath}`,
    rating: new Prisma.Decimal(s.rating),
  }
}

export const season: QueryResolvers['season'] = async ({ showTmdbId, seasonNumber }) => {
  const s: PrismaSeason | CachedPrismaSeason = await cache(
    ['show-season', showTmdbId.toString(), seasonNumber.toString()],
    () => db.showSeason.findFirst({ where: { show: { tmdbId: showTmdbId }, number: seasonNumber } }),
    { expires: 60 * 60 * 24 * 31 }
  )

  return {
    ...s,
    airDate: new Date(s.airDate),
    posterUrl: `http://image.tmdb.org/t/p/w342${s.tmdbPosterPath}`,
    rating: new Prisma.Decimal(s.rating).toNumber(),
  }
}

export const Show: ShowRelationResolvers = {
  seasons: async (_obj, { root }) => {
    const seasons: PrismaSeason[] | CachedPrismaSeason[] = await cacheFindMany('seasons', db.showSeason, {
      conditions: { where: { showId: root?.id } },
    })

    return seasons.map((season) => ({
      ...season,
      airDate: new Date(season.airDate),
      posterUrl: `http://image.tmdb.org/t/p/w342${season.tmdbPosterPath}`,
      rating: new Prisma.Decimal(season.rating).toNumber(),
    }))
  },
  userProgress: async (_obj, { root }) => {
    if (context.currentUser) {
      return getUserShowProgress(root.id)
    }

    return null
  },
}

export const Season: SeasonRelationResolvers = {
  episodes: async (_obj, { root }) => {
    const episodes: PrismaEpisode[] | CachedPrismaEpisode[] = await cacheFindMany('episodes', db.showEpisode, {
      conditions: { where: { seasonId: root?.id } },
    })

    return episodes.map((episode) => ({
      ...episode,
      airDate: new Date(episode.airDate),
      rating: new Prisma.Decimal(episode.rating).toNumber(),
      stillUrl: `http://image.tmdb.org/t/p/w342${episode.tmdbStillPath}`,
    }))
  },
  userProgress: async (_obj, { root }) => {
    if (context.currentUser) {
      const { _count: counts } = await db.showSeason.findUnique({
        where: { id: root.id },
        select: {
          _count: {
            select: {
              episodes: true,
              watchedEpisodes: { where: { userId: context.currentUser.id } },
            },
          },
        },
      })

      return { watched: counts.episodes === counts.watchedEpisodes }
    }

    return null
  },
}
