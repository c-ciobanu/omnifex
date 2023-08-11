import { fetch } from '@whatwg-node/fetch'
import type { QueryResolvers } from 'types/graphql'

export const movies: QueryResolvers['movies'] = async ({ title }) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?query=${title}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_ACCESS_TOKEN}`,
      },
    }
  )
  const json = await response.json()

  return json.results.map((result) => ({
    id: result.id,
    title: result.title,
    posterUrl: `http://image.tmdb.org/t/p/w185${result.poster_path}`,
  }))
}
