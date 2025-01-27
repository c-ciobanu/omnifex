import type { MutationResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const watchShow: MutationResolvers['watchShow'] = async ({ id }) => {
  requireAuth()

  const episodes = await db.showEpisode.findMany({ where: { showId: id } })

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
