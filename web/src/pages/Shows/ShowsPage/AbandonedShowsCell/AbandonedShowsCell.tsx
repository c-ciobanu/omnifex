import type { AbandonedShowsQuery, AbandonedShowsQueryVariables } from 'types/graphql'

import { Link, routes } from '@cedarjs/router'
import type { CellSuccessProps, CellFailureProps, TypedDocumentNode } from '@cedarjs/web'

export const QUERY: TypedDocumentNode<AbandonedShowsQuery, AbandonedShowsQueryVariables> = gql`
  query AbandonedShowsQuery {
    abandonedShows {
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

export const Success = ({ abandonedShows }: CellSuccessProps<AbandonedShowsQuery, AbandonedShowsQueryVariables>) => {
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
      {abandonedShows.map((userShow) => (
        <li key={userShow.id}>
          <Link to={routes.show({ tmdbId: userShow.tmdbId })} title={userShow.title}>
            <img src={userShow.posterUrl} alt={`${userShow.title} poster`} className="h-full w-full" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
