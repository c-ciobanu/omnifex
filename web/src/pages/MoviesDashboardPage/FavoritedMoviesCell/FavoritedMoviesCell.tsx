import type { FavoritedMoviesQuery, FavoritedMoviesQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps, TypedDocumentNode } from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<FavoritedMoviesQuery, FavoritedMoviesQueryVariables> = gql`
  query FavoritedMoviesQuery($numberToShow: Int) {
    favoriteMovies(input: { take: $numberToShow }) {
      id
      title
      tmdbId
      posterUrl
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ favoriteMovies }: CellSuccessProps<FavoritedMoviesQuery>) => {
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
      {favoriteMovies.map((movie) => (
        <li key={movie.id}>
          <Link to={routes.movie({ tmdbId: movie.tmdbId })} title={movie.title}>
            <img src={movie.posterUrl} alt={`${movie.title} poster`} />
          </Link>
        </li>
      ))}
    </ul>
  )
}
