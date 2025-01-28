import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

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
    backdropUrl: `http://image.tmdb.org/t/p/w1280${s.tmdbBackdropPath}`,
    posterUrl: `http://image.tmdb.org/t/p/w342${s.tmdbPosterPath}`,
  }))
}

export const watchlistShow: MutationResolvers['watchlistShow'] = ({ showId }) => {
  requireAuth()

  return db.watchlistShow.create({ data: { userId: context.currentUser.id, showId } })
}

export const unwatchlistShow: MutationResolvers['unwatchlistShow'] = ({ showId }) => {
  requireAuth()

  return db.watchlistShow.delete({ where: { userId_showId: { userId: context.currentUser.id, showId } } })
}
