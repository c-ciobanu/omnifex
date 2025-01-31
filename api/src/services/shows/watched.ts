import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import { unabandonShow } from './abandoned'
import { getUserShowProgress } from './shows'
import { isShowInWatchlist, unwatchlistShow } from './watchlist'

export const watchedShows: QueryResolvers['watchedShows'] = async () => {
  requireAuth()

  const shows = await db.show.findMany({
    where: { watchedEpisodes: { some: { userId: context.currentUser.id } } },
    include: {
      _count: {
        select: {
          episodes: true,
          watchedEpisodes: { where: { userId: context.currentUser.id } },
        },
      },
    },
  })

  const watchedShows = shows.filter((s) => s._count.watchedEpisodes === s._count.episodes)

  return watchedShows.map((s) => ({
    ...s,
    backdropUrl: `http://image.tmdb.org/t/p/w1280${s.tmdbBackdropPath}`,
    posterUrl: `http://image.tmdb.org/t/p/w342${s.tmdbPosterPath}`,
  }))
}

export const watchShow: MutationResolvers['watchShow'] = async ({ id }) => {
  requireAuth()

  const episodes = await db.showEpisode.findMany({ where: { showId: id } })
  const showProgress = await getUserShowProgress(id)

  if (showProgress.inWatchlist) {
    await unwatchlistShow({ id })
  }

  if (showProgress.abandoned) {
    await unabandonShow({ id })
  }

  return db.watchedEpisode.createManyAndReturn({
    data: episodes.map((e) => ({
      userId: context.currentUser.id,
      showId: e.showId,
      seasonId: e.seasonId,
      episodeId: e.id,
    })),
    skipDuplicates: true,
  })
}

export const watchSeason: MutationResolvers['watchSeason'] = async ({ id }) => {
  requireAuth()

  const episodes = await db.showEpisode.findMany({ where: { seasonId: id } })
  const showId = episodes[0].showId
  const inWatchlist = await isShowInWatchlist(showId)

  if (inWatchlist) {
    await unwatchlistShow({ id: showId })
  }

  return db.watchedEpisode.createManyAndReturn({
    data: episodes.map((e) => ({
      userId: context.currentUser.id,
      showId: e.showId,
      seasonId: e.seasonId,
      episodeId: e.id,
    })),
    skipDuplicates: true,
  })
}

export const watchEpisode: MutationResolvers['watchEpisode'] = async ({ id }) => {
  requireAuth()

  const episode = await db.showEpisode.findUnique({ where: { id } })
  const showId = episode.showId
  const inWatchlist = await isShowInWatchlist(showId)

  if (inWatchlist) {
    await unwatchlistShow({ id: showId })
  }

  return db.watchedEpisode.create({
    data: {
      userId: context.currentUser.id,
      showId: episode.showId,
      seasonId: episode.seasonId,
      episodeId: episode.id,
    },
  })
}

export const unwatchShow: MutationResolvers['unwatchShow'] = ({ id }) => {
  requireAuth()

  return db.watchedEpisode.deleteMany({ where: { userId: context.currentUser.id, showId: id } })
}

export const unwatchSeason: MutationResolvers['unwatchSeason'] = ({ id }) => {
  requireAuth()

  return db.watchedEpisode.deleteMany({ where: { userId: context.currentUser.id, seasonId: id } })
}

export const unwatchEpisode: MutationResolvers['unwatchEpisode'] = ({ id }) => {
  requireAuth()

  return db.watchedEpisode.delete({ where: { userId_episodeId: { userId: context.currentUser.id, episodeId: id } } })
}
