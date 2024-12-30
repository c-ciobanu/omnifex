import type { QueryResolvers } from 'types/graphql'

import { cache } from 'src/lib/cache'
import { searchTMDBShows, TMDBSearchShow } from 'src/lib/tmdb'

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
