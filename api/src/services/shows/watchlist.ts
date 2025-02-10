import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { validateWith } from '@redwoodjs/api'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import { getUserShowProgress } from './shows'

export const isShowInWatchlist = async (id: number) => {
  requireAuth()

  const count = await db.watchlistShow.count({ where: { showId: id, userId: context.currentUser.id } })

  return count === 1
}

export const showsWatchlist: QueryResolvers['showsWatchlist'] = async () => {
  requireAuth()

  const shows = await db.show.findMany({
    where: {
      OR: [
        { watchedEpisodes: { some: { userId: context.currentUser.id } } },
        {
          inWatchlist: { some: { userId: context.currentUser.id } },
        },
      ],
      abandoned: { none: { userId: context.currentUser.id } },
    },
    include: {
      _count: {
        select: {
          episodes: true,
          watchedEpisodes: { where: { userId: context.currentUser.id } },
          inWatchlist: true,
        },
      },
    },
  })

  const inProgressShows = shows.filter(
    (s) => s._count.inWatchlist === 1 || s._count.watchedEpisodes !== s._count.episodes
  )

  return inProgressShows.map((s) => ({
    ...s,
    backdropUrl: s.tmdbBackdropPath ? `https://image.tmdb.org/t/p/w1280${s.tmdbBackdropPath}` : undefined,
    posterUrl: `https://image.tmdb.org/t/p/w342${s.tmdbPosterPath}`,
  }))
}

export const watchlistShow: MutationResolvers['watchlistShow'] = async ({ id }) => {
  requireAuth()

  await validateWith(async () => {
    const showProgress = await getUserShowProgress(id)

    if (showProgress.abandoned) {
      throw new Error('Unable to add an abandoned show to the watchlist.')
    }

    if (showProgress.watched) {
      throw new Error('Unable to add a watched show to the watchlist.')
    }
  })

  return db.watchlistShow.create({ data: { userId: context.currentUser.id, showId: id } })
}

export const unwatchlistShow: MutationResolvers['unwatchlistShow'] = ({ id }) => {
  requireAuth()

  return db.watchlistShow.delete({ where: { userId_showId: { userId: context.currentUser.id, showId: id } } })
}
