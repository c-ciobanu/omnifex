import { fetch } from '@whatwg-node/fetch'
import AdmZip from 'adm-zip'
import { db } from 'api/src/lib/db'
import { createShow } from 'api/src/services/shows/shows'

interface Ids {
  trakt: number
  slug: string
  tvdb?: number
  imdb?: string
  tmdb: number
}

interface TraktShow {
  title: string
  year: number
  ids: Ids
}

interface TraktWatchedShow {
  plays: number
  last_watched_at: string
  last_updated_at: string
  show: TraktShow
  seasons: {
    number: number
    episodes: {
      number: number
      plays: number
      last_watched_at: string
    }[]
  }[]
}

interface TraktWatchlistShow {
  rank: number
  id: number
  listed_at: string
  notes?: string
  type: string
  show: TraktShow
}

interface Args {
  userId?: number
  traktUsername?: string
}

export default async ({ args }: { args: Args }) => {
  const { userId, traktUsername } = args

  if (!traktUsername) {
    throw new Error('trakt-username arg required')
  }

  if (!userId) {
    throw new Error('user-id arg required')
  }

  const response = await fetch(`https://darekkay.com/service/trakt/trakt.php?username=${traktUsername}`)

  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const zip = new AdmZip(buffer)

  const traktData: { watchedShows: TraktWatchedShow[]; showsWatchlist: TraktWatchlistShow[] } = {
    watchedShows: JSON.parse(zip.getEntry('watched_shows.json').getData().toString('utf-8')),
    showsWatchlist: JSON.parse(zip.getEntry('watchlist_shows.json').getData().toString('utf-8')),
  }

  const traktShowTmdbIds = [
    ...traktData.watchedShows.map((s) => s.show.ids.tmdb),
    ...traktData.showsWatchlist.map((s) => s.show.ids.tmdb),
  ]

  const shows = await db.show.findMany({
    where: { tmdbId: { in: traktShowTmdbIds } },
    include: { seasons: { include: { episodes: true } } },
  })

  const showsToCreate = traktShowTmdbIds.filter((traktShowTmdbId) => !shows.some((s) => s.tmdbId === traktShowTmdbId))

  for (const tmdbId of showsToCreate) {
    await createShow(tmdbId)
  }

  const newShows = await db.show.findMany({
    where: { tmdbId: { in: showsToCreate } },
    include: { seasons: { include: { episodes: true } } },
  })
  shows.push(...newShows)

  if (traktData.watchedShows.length !== 0) {
    const data = []
    const showsToUnwatchlist: number[] = []

    traktData.watchedShows.forEach((traktShow) => {
      const show = shows.find((show) => show.tmdbId === traktShow.show.ids.tmdb)

      showsToUnwatchlist.push(show.id)

      traktShow.seasons.forEach((traktSeason) => {
        const season = show.seasons.find((season) => season.number === traktSeason.number)

        traktSeason.episodes.forEach((traktEpisode) => {
          const episode = season.episodes.find((episode) => episode.number === traktEpisode.number)
          if (episode) {
            data.push({ userId, showId: show.id, seasonId: season.id, episodeId: episode.id })
          } else {
            console.info(`${traktShow.show.title} S${traktSeason.number} E${traktEpisode.number} missing.`)
          }
        })
      })
    })

    await db.watchlistShow.deleteMany({ where: { userId, showId: { in: showsToUnwatchlist } } })
    await db.watchedEpisode.createMany({ data, skipDuplicates: true })
  }

  if (traktData.showsWatchlist.length !== 0) {
    const data = traktData.showsWatchlist.map((s) => ({
      userId,
      showId: shows.find((show) => show.tmdbId === s.show.ids.tmdb).id,
    }))

    // FIXME: should use watchlistShow or copy the validation here
    await db.watchlistShow.createMany({ data, skipDuplicates: true })
  }
}
