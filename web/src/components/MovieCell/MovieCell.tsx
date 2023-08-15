import type { MovieQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Movie from 'src/components/Movie'
import MovieStatusesControls from 'src/components/MovieStatusesControls'

export const QUERY = gql`
  query MovieQuery($id: Int!) {
    movie(id: $id) {
      genres
      id
      overview
      posterUrl
      rating
      releaseYear
      runtime
      tagline
      title
      user {
        favorited
        watched
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ movie }: CellSuccessProps<MovieQuery>) => {
  return (
    <>
      <div className="mb-4 flex justify-around bg-neutral-800 py-3 text-gray-400">
        <MovieStatusesControls id={movie.id} statuses={movie.user} />
      </div>

      <Movie movie={movie} />
    </>
  )
}
