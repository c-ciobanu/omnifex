import { Star } from 'lucide-react'
import type { MovieQuery } from 'types/graphql'

import { type CellSuccessProps, type CellFailureProps, Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

import Actions from './Actions'

export const QUERY = gql`
  query MovieQuery($tmdbId: Int!) {
    movie(tmdbId: $tmdbId) {
      id
      genres
      overview
      posterUrl
      rating
      releaseDate
      runtime
      tagline
      title
      tmdbId
      userInfo {
        favorited
        watched
        inWatchlist
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const formatMinutesToHoursAndMinutes = (minutes: number) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  return `${h}h ${m}m`
}

export const Success = ({ movie }: CellSuccessProps<MovieQuery>) => {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Metadata title={movie.title} description={movie.overview} />

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div>
          <h2 className="text-2xl font-bold">{movie.title}</h2>
          {movie.tagline ? <q>{movie.tagline}</q> : null}
          <h4 className="flex items-center text-gray-400">
            {movie.releaseDate.split('-')[0]}
            {' · '}
            {formatMinutesToHoursAndMinutes(movie.runtime)}
            {' ·  '}
            <Star className="mx-1 h-5 w-5 fill-yellow-300 text-yellow-300" />
            <span className="text-lg font-bold text-gray-900">{movie.rating}</span>/10
          </h4>

          <div className="mt-6 flex items-start gap-6">
            <img src={movie.posterUrl} alt={`${movie.title} poster`} className="w-1/4" />

            <div className="space-y-3">
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre}
                    className="nline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <p className="prose max-w-none">{movie.overview}</p>
            </div>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="lg:w-72 lg:flex-shrink-0">
            <Actions movie={movie} />
          </div>
        ) : null}
      </div>
    </>
  )
}
