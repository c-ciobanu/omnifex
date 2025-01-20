import { Prisma, Show as PrismaShow, ShowEpisode as PrismaEpisode, ShowSeason as PrismaSeason } from '@prisma/client'
import { DefaultShowLists } from 'common'
import type { QueryResolvers, SeasonRelationResolvers, ShowRelationResolvers } from 'types/graphql'

import { cache, cacheFindMany } from 'src/lib/cache'
import { db } from 'src/lib/db'
import { getTMDBShow, getTMDBShowSeason, searchTMDBShows, TMDBSearchShow } from 'src/lib/tmdb'

import { userDefaultShowLists } from '../showLists/showLists'

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
  userInfo: async (_obj, { root }) => {
    if (context.currentUser) {
      const userLists = await userDefaultShowLists()

      const watchedShowCount = await db.showListItem.count({
        where: { showId: root.id, listId: userLists[DefaultShowLists.Watched].id },
      })
      const toWatchShowCount = await db.showListItem.count({
        where: { showId: root.id, listId: userLists[DefaultShowLists.Watchlist].id },
      })
      const abandonedShowCount = await db.showListItem.count({
        where: { showId: root.id, listId: userLists[DefaultShowLists.Abandoned].id },
      })

      return {
        watched: watchedShowCount === 1,
        inWatchlist: toWatchShowCount === 1,
        abandoned: abandonedShowCount === 1,
      }
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
}
