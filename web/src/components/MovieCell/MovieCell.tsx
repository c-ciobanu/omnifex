import type { MovieQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Movie from 'src/components/Movie'
import MovieActions from 'src/components/MovieActions'

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
      <div className="mb-6 flex justify-around bg-white py-4 shadow">
        <MovieActions id={movie.id} statuses={movie.user} />
      </div>

      <Movie movie={movie} />
    </>
  )
}
