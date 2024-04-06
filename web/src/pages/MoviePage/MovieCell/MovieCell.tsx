import type { MovieQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

import Actions from './Actions'
import Details from './Details'

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

export const Success = ({ movie }: CellSuccessProps<MovieQuery>) => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
      <Details movie={movie} />

      {isAuthenticated ? (
        <div className="lg:w-72 lg:flex-shrink-0">
          <Actions movie={movie} />
        </div>
      ) : null}
    </div>
  )
}
