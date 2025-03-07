import type { ShowsQuery, ShowsQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellFailureProps, CellSuccessProps, TypedDocumentNode } from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<ShowsQuery, ShowsQueryVariables> = gql`
  query ShowsQuery($title: String!) {
    shows(title: $title) {
      tmdbId
      overview
      posterUrl
      releaseYear
      title
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ shows }: CellSuccessProps<ShowsQuery, ShowsQueryVariables>) => {
  return (
    <ul className="grid grid-cols-1 divide-y divide-white sm:grid-cols-2 sm:divide-none lg:grid-cols-3">
      {shows.map((show) => {
        return (
          <li key={show.tmdbId}>
            <Link
              to={routes.show({ tmdbId: show.tmdbId })}
              title={show.title}
              className="grid grid-cols-[128px_1fr] gap-6 py-6 hover:bg-white"
            >
              <img src={show.posterUrl} alt={`${show.title} poster`} className="h-44 w-full" />
              <div>
                <p>{show.title}</p>
                <p className="text-gray-500">{show.releaseYear}</p>
                <p className="line-clamp-3 text-sm text-gray-500 sm:line-clamp-4">{show.overview}</p>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
