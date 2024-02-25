import type { MovieQuery } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
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
        watchlisted
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
    <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:gap-8">
      <Movie movie={movie} />

      {isAuthenticated ? (
        <div className="lg:w-72 lg:flex-shrink-0">
          <MovieActions id={movie.id} userState={movie.user} />
        </div>
      ) : null}
    </div>
  )
}
