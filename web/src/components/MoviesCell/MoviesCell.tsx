import type { MoviesQuery } from 'types/graphql'

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

export const Failure = ({ error }: CellFailureProps) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ movies }: CellSuccessProps<MoviesQuery>) => {
  return (
    <ul className="divide-y-2 divide-neutral-800">
      {movies.map((movie) => {
        return (
          <li key={movie.id} className="flex gap-4 p-2">
            <img src={movie.posterUrl} alt={`${movie.title} poster`} />
            <div>
              <p className="text-yellow-300">{movie.title}</p>
              <p className="text-neutral-400">{movie.releaseYear}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
