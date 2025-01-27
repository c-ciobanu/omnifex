import { DefaultShowLists } from 'common'
import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { validateWith } from '@redwoodjs/api'
import { AuthenticationError } from '@redwoodjs/graphql-server'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

const requireShowListOwner = async (listId: number) => {
  const showListCount = await db.showList.count({ where: { id: listId, userId: context.currentUser.id } })

  if (showListCount === 0) {
    throw new AuthenticationError("You don't have permission to do that.")
  }
}

/**
 * Returns information about the 3 default show lists of a user.
 *
 * @remarks
 * It is best used in combination with DefaultShowLists.
 *
 * @example
 * ```ts
 * const lists = await userDefaultShowLists()
 * const watchedList = lists[DefaultShowLists.Watched]
 * ```
 */

export const userDefaultShowLists = async () => {
  requireAuth()

  const showLists = await db.showList.findMany({
    where: {
      userId: context.currentUser.id,
      name: { in: [DefaultShowLists.Watchlist, DefaultShowLists.Watched, DefaultShowLists.Abandoned] },
    },
    select: { id: true, name: true },
    orderBy: { name: 'desc' },
  })

  return {
    [DefaultShowLists.Watchlist]: showLists[0],
    [DefaultShowLists.Watched]: showLists[1],
    [DefaultShowLists.Abandoned]: showLists[2],
  }
}

export const showLists: QueryResolvers['showLists'] = () => {
  requireAuth()

  return db.showList.findMany({ where: { userId: context.currentUser.id } })
}

export const createShowList: MutationResolvers['createShowList'] = ({ input }) => {
  requireAuth()

  return db.showList.create({ data: { ...input, userId: context.currentUser.id } })
}

export const updateShowList: MutationResolvers['updateShowList'] = ({ id, input }) => {
  requireAuth()

  return db.showList.update({ data: input, where: { id, userId: context.currentUser.id } })
}

export const deleteShowList: MutationResolvers['deleteShowList'] = ({ id }) => {
  requireAuth()

  return db.showList.delete({ where: { id, userId: context.currentUser.id } })
}

export const showListItems: QueryResolvers['showListItems'] = async ({ listId }) => {
  requireAuth()
  await requireShowListOwner(listId)

  const showListItems = await db.showListItem.findMany({
    where: { listId },
    select: { show: true },
    orderBy: { createdAt: 'desc' },
  })

  const shows = showListItems.map((fm) => fm.show)

  return shows.map((s) => ({
    ...s,
    backdropUrl: `http://image.tmdb.org/t/p/w1280${s.tmdbBackdropPath}`,
    posterUrl: `http://image.tmdb.org/t/p/w342${s.tmdbPosterPath}`,
  }))
}

export const createShowListItem: MutationResolvers['createShowListItem'] = async ({ input: { listName, showId } }) => {
  requireAuth()

  if (listName === DefaultShowLists.Watched) {
    const watchlistShowCount = await db.showListItem.count({
      where: { showId, list: { userId: context.currentUser.id, name: DefaultShowLists.Watchlist } },
    })

    if (watchlistShowCount === 1) {
      await deleteShowListItem({ listName: DefaultShowLists.Watchlist, showId })
    }

    const abandonedShowCount = await db.showListItem.count({
      where: { showId, list: { userId: context.currentUser.id, name: DefaultShowLists.Abandoned } },
    })

    if (abandonedShowCount === 1) {
      await deleteShowListItem({ listName: DefaultShowLists.Abandoned, showId })
    }
  } else if (listName === DefaultShowLists.Watchlist) {
    await validateWith(async () => {
      const abandonedShowCount = await db.showListItem.count({
        where: { showId, list: { userId: context.currentUser.id, name: DefaultShowLists.Abandoned } },
      })

      if (abandonedShowCount === 1) {
        throw new Error('Unable to add an abandoned show to the watchlist.')
      }

      const watchedShowCount = await db.showListItem.count({
        where: { showId, list: { userId: context.currentUser.id, name: DefaultShowLists.Watched } },
      })

      if (watchedShowCount === 1) {
        throw new Error('Unable to add a watched show to the watchlist.')
      }
    })
  } else if (listName === DefaultShowLists.Abandoned) {
    await validateWith(async () => {
      const watchlistShowCount = await db.showListItem.count({
        where: { showId, list: { userId: context.currentUser.id, name: DefaultShowLists.Watchlist } },
      })

      if (watchlistShowCount === 1) {
        throw new Error('Unable to move a show from the watchlist to the abandoned list.')
      }

      const watchedShowCount = await db.showListItem.count({
        where: { showId, list: { userId: context.currentUser.id, name: DefaultShowLists.Watched } },
      })

      if (watchedShowCount === 1) {
        throw new Error('Unable to add a watched show to the abandoned list.')
      }
    })
  }

  const list = await db.showList.findFirst({
    where: { userId: context.currentUser.id, name: listName },
    select: { id: true },
  })

  return db.showListItem.create({ data: { listId: list.id, showId } })
}

export const deleteShowListItem: MutationResolvers['deleteShowListItem'] = async ({ listName, showId }) => {
  requireAuth()

  const list = await db.showList.findFirst({
    where: { userId: context.currentUser.id, name: listName },
    select: { id: true },
  })

  return db.showListItem.delete({ where: { listId_showId: { listId: list.id, showId } } })
}

export const watchedShows: QueryResolvers['watchedShows'] = async () => {
  requireAuth()

  const watchedEpisodesByShow = await db.watchedEpisode.groupBy({
    by: ['showId'],
    where: { userId: context.currentUser.id },
    _count: true,
  })

  const shows = await db.show.findMany({
    where: { id: { in: watchedEpisodesByShow.map((e) => e.showId) } },
    include: { _count: { select: { episodes: true } } },
  })

  const watchedShows = shows.filter((s) => {
    const watchedEpisodes = watchedEpisodesByShow.find((e) => e.showId === s.id)._count

    return watchedEpisodes === s._count.episodes
  })

  return watchedShows.map((s) => ({
    ...s,
    backdropUrl: `http://image.tmdb.org/t/p/w1280${s.tmdbBackdropPath}`,
    posterUrl: `http://image.tmdb.org/t/p/w342${s.tmdbPosterPath}`,
  }))
}

export const showsWatchlist: QueryResolvers['showsWatchlist'] = async () => {
  requireAuth()

  const watchedEpisodesByShow = await db.watchedEpisode.groupBy({
    by: ['showId'],
    where: { userId: context.currentUser.id },
    _count: true,
  })

  const shows = await db.show.findMany({
    where: { id: { in: watchedEpisodesByShow.map((e) => e.showId) } },
    include: { _count: { select: { episodes: true } } },
  })

  const watchingShows = shows.filter((s) => {
    const watchedEpisodes = watchedEpisodesByShow.find((e) => e.showId === s.id)._count

    return watchedEpisodes !== s._count.episodes
  })

  return watchingShows.map((s) => ({
    ...s,
    backdropUrl: `http://image.tmdb.org/t/p/w1280${s.tmdbBackdropPath}`,
    posterUrl: `http://image.tmdb.org/t/p/w342${s.tmdbPosterPath}`,
  }))
}
