import type { MovieListItemsQuery, MovieListItemsQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps, TypedDocumentNode } from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<MovieListItemsQuery, MovieListItemsQueryVariables> = gql`
  query MovieListItemsQuery($listId: Int!) {
    movieListItems(listId: $listId) {
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

export const Success = ({ movieListItems }: CellSuccessProps<MovieListItemsQuery>) => {
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
      {movieListItems.map((userMovie) => (
        <li key={userMovie.id}>
          <Link to={routes.movie({ tmdbId: userMovie.tmdbId })} title={userMovie.title}>
            <img src={userMovie.posterUrl} alt={`${userMovie.title} poster`} className="h-full w-full" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
