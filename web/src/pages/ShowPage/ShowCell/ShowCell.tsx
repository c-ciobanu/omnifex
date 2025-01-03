import { Star } from 'lucide-react'
import type { ShowQuery } from 'types/graphql'

import { type CellFailureProps, type CellSuccessProps, Metadata } from '@redwoodjs/web'

export const QUERY = gql`
  query ShowQuery($tmdbId: Int!) {
    show(tmdbId: $tmdbId) {
      creators
      genres
      originalTitle
      overview
      posterUrl
      rating
      tagline
      title
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ show }: CellSuccessProps<ShowQuery>) => {
  return (
    <>
      <Metadata title={show.title} description={show.overview} />

      <div>
        <h2 className="text-2xl font-bold">{show.title}</h2>

        {show.tagline ? <q>{show.tagline}</q> : null}

        {show.originalTitle !== show.title ? <p>Original title: {show.originalTitle}</p> : null}

        <p>Created by: {show.creators.join(', ')}</p>

        <h4 className="flex items-center text-gray-400">
          <Star className="mx-1 h-5 w-5 fill-yellow-300 text-yellow-300" />
          <span className="font-medium text-gray-900">{show.rating}</span>/10
        </h4>

        <div className="mt-6 flex items-start gap-6">
          <img src={show.posterUrl} alt={`${show.title} poster`} className="w-1/4" />

          <div className="space-y-3">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {show.genres.map((genre) => (
                <span
                  key={genre}
                  className="nline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                >
                  {genre}
                </span>
              ))}
            </div>
            <p className="prose max-w-none">{show.overview}</p>
          </div>
        </div>
      </div>
    </>
  )
}
