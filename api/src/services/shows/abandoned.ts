import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { validateWith } from '@redwoodjs/api'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

import { getUserShowProgress } from './shows'

export const abandonedShows: QueryResolvers['abandonedShows'] = async () => {
  requireAuth()

  const shows = await db.show.findMany({
    where: { abandoned: { some: { userId: context.currentUser.id } } },
  })

  return shows.map((s) => ({
    ...s,
    backdropUrl: `https://image.tmdb.org/t/p/w1280${s.tmdbBackdropPath}`,
    posterUrl: `https://image.tmdb.org/t/p/w342${s.tmdbPosterPath}`,
  }))
}

export const abandonShow: MutationResolvers['abandonShow'] = async ({ id }) => {
  requireAuth()

  await validateWith(async () => {
    const showProgress = await getUserShowProgress(id)

    if (showProgress.inWatchlist) {
      throw new Error('Unable to move a show from the watchlist to the abandoned list.')
    }

    if (showProgress.watched) {
      throw new Error('Unable to add a watched show to the abandoned list.')
    }
  })

  return db.abandonedShow.create({ data: { userId: context.currentUser.id, showId: id } })
}

export const unabandonShow: MutationResolvers['unabandonShow'] = ({ id }) => {
  requireAuth()

  return db.abandonedShow.delete({ where: { userId_showId: { userId: context.currentUser.id, showId: id } } })
}
