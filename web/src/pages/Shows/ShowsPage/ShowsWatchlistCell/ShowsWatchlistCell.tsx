import type { ShowsWatchlistQuery, ShowsWatchlistQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps, TypedDocumentNode } from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<ShowsWatchlistQuery, ShowsWatchlistQueryVariables> = gql`
  query ShowsWatchlistQuery {
    showsWatchlist {
      id
      title
      tmdbId
      userProgress {
        nextEpisodeToWatch {
          id
          number
          season {
            id
            number
            posterUrl
          }
        }
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ showsWatchlist }: CellSuccessProps<ShowsWatchlistQuery>) => {
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
      {showsWatchlist.map((show) => (
        <li key={show.id}>
          <Link to={routes.show({ tmdbId: show.tmdbId })} title={show.title} className="group relative">
            <img
              src={show.userProgress.nextEpisodeToWatch.season.posterUrl}
              alt={`${show.title} season ${show.userProgress.nextEpisodeToWatch.season.number} poster`}
              className="h-full w-full"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="absolute left-2 top-2 text-sm text-white">
                Next: {show.userProgress.nextEpisodeToWatch.season.number.toString().padStart(2, '0')}x
                {show.userProgress.nextEpisodeToWatch.number.toString().padStart(2, '0')}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
