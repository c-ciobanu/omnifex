import { DefaultMovieLists } from 'common'
import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { validateWith } from '@redwoodjs/api'
import { AuthenticationError } from '@redwoodjs/graphql-server'

import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

const requireMovieListOwner = async (listId: number) => {
  const movieListCount = await db.movieList.count({ where: { id: listId, userId: context.currentUser.id } })

  if (movieListCount === 0) {
    throw new AuthenticationError("You don't have permission to do that.")
  }
}

/**
 * Returns information about the 3 default movie lists of a user.
 *
 * @remarks
 * It is best used in combination with DefaultMovieLists.
 *
 * @example
 * ```ts
 * const lists = await userDefaultMovieLists()
 * const watchedList = lists[DefaultMovieLists.Watched]
 * ```
 */

export const userDefaultMovieLists = async () => {
  requireAuth()

  const movieLists = await db.movieList.findMany({
    where: { userId: context.currentUser.id, name: { in: [DefaultMovieLists.Watchlist, DefaultMovieLists.Watched] } },
    select: { id: true, name: true },
    orderBy: { name: 'desc' },
  })

  return { [DefaultMovieLists.Watchlist]: movieLists[0], [DefaultMovieLists.Watched]: movieLists[1] }
}

export const movieLists: QueryResolvers['movieLists'] = () => {
  requireAuth()

  return db.movieList.findMany({ where: { userId: context.currentUser.id } })
}

export const createMovieList: MutationResolvers['createMovieList'] = ({ input }) => {
  requireAuth()

  return db.movieList.create({ data: { ...input, userId: context.currentUser.id } })
}

export const updateMovieList: MutationResolvers['updateMovieList'] = ({ id, input }) => {
  requireAuth()

  return db.movieList.update({ data: input, where: { id, userId: context.currentUser.id } })
}

export const deleteMovieList: MutationResolvers['deleteMovieList'] = ({ id }) => {
  requireAuth()

  return db.movieList.delete({ where: { id, userId: context.currentUser.id } })
}

export const movieListItems: QueryResolvers['movieListItems'] = async ({ listId }) => {
  requireAuth()
  await requireMovieListOwner(listId)

  const movieListItems = await db.movieListItem.findMany({
    where: { listId },
    select: { movie: true },
    orderBy: { createdAt: 'desc' },
  })

  const movies = movieListItems.map((fm) => fm.movie)

  return movies.map((m) => ({
    ...m,
    posterUrl: `https://image.tmdb.org/t/p/w185${m.tmdbPosterPath}`,
  }))
}

export const createMovieListItem: MutationResolvers['createMovieListItem'] = async ({
  input: { listName, movieId },
}) => {
  requireAuth()

  if (listName === DefaultMovieLists.Watched) {
    const watchlistMovieCount = await db.movieListItem.count({
      where: { movieId, list: { userId: context.currentUser.id, name: DefaultMovieLists.Watchlist } },
    })

    if (watchlistMovieCount === 1) {
      await deleteMovieListItem({ listName: DefaultMovieLists.Watchlist, movieId })
    }
  } else if (listName === DefaultMovieLists.Watchlist) {
    await validateWith(async () => {
      const watchedMovieCount = await db.movieListItem.count({
        where: { movieId, list: { userId: context.currentUser.id, name: DefaultMovieLists.Watched } },
      })

      if (watchedMovieCount === 1) {
        throw new Error('Unable to add a watched movie to the watchlist.')
      }
    })
  }

  const list = await db.movieList.findFirst({
    where: { userId: context.currentUser.id, name: listName },
    select: { id: true },
  })

  return db.movieListItem.create({ data: { listId: list.id, movieId } })
}

export const deleteMovieListItem: MutationResolvers['deleteMovieListItem'] = async ({ listName, movieId }) => {
  requireAuth()

  const list = await db.movieList.findFirst({
    where: { userId: context.currentUser.id, name: listName },
    select: { id: true },
  })

  return db.movieListItem.delete({ where: { listId_movieId: { listId: list.id, movieId } } })
}
