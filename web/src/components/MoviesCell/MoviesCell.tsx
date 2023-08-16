import type { MoviesQuery } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query MoviesQuery($title: String!) {
    movies(title: $title) {
      id
      posterUrl
      releaseYear
      title
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ movies }: CellSuccessProps<MoviesQuery>) => {
  return (
    <ul className="divide-y divide-white">
      {movies.map((movie) => {
        return (
          <li key={movie.id}>
            <Link
              to={routes.movie({ id: movie.id })}
              title={`'Show ${movie.title} movie details`}
              className="flex gap-x-6 py-5 hover:bg-white"
            >
              <img src={movie.posterUrl} alt={`${movie.title} poster`} />
              <div>
                <p>{movie.title}</p>
                <p className="text-gray-500">{movie.releaseYear}</p>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
