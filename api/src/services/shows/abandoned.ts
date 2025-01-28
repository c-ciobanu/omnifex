import type { MutationResolvers, QueryResolvers } from 'types/graphql'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const abandonedShows: QueryResolvers['abandonedShows'] = async () => {
  requireAuth()

  const shows = await db.show.findMany({
    where: { abandoned: { some: { userId: context.currentUser.id } } },
  })

  return shows.map((s) => ({
    ...s,
    backdropUrl: `http://image.tmdb.org/t/p/w1280${s.tmdbBackdropPath}`,
    posterUrl: `http://image.tmdb.org/t/p/w342${s.tmdbPosterPath}`,
  }))
}

export const abandonShow: MutationResolvers['abandonShow'] = ({ showId }) => {
  requireAuth()

  return db.abandonedShow.create({ data: { userId: context.currentUser.id, showId } })
}

export const unabandonShow: MutationResolvers['unabandonShow'] = ({ showId }) => {
  requireAuth()

  return db.abandonedShow.delete({ where: { userId_showId: { userId: context.currentUser.id, showId } } })
}
