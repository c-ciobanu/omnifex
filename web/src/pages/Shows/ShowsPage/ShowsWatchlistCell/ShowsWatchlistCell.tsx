import type { ShowsWatchlistQuery, ShowsWatchlistQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps, TypedDocumentNode } from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<ShowsWatchlistQuery, ShowsWatchlistQueryVariables> = gql`
  query ShowsWatchlistQuery {
    showsWatchlist {
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

export const Success = ({ showsWatchlist }: CellSuccessProps<ShowsWatchlistQuery>) => {
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
      {showsWatchlist.map((userShow) => (
        <li key={userShow.id}>
          <Link to={routes.show({ tmdbId: userShow.tmdbId })} title={userShow.title}>
            <img src={userShow.posterUrl} alt={`${userShow.title} poster`} className="h-full w-full" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
