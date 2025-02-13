import { isAfter, isBefore } from 'date-fns'
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
      userProgress {
        nextEpisode {
          id
          airDate
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

interface ShowsGridProps {
  shows: ShowsWatchlistQuery['showsWatchlist']
}

const ShowsGrid = ({ shows }: ShowsGridProps) => (
  <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
    {shows.map((show) => (
      <li key={show.id}>
        <Link to={routes.show({ tmdbId: show.tmdbId })} title={show.title} className="group relative">
          <img
            src={show.userProgress.nextEpisode.season.posterUrl ?? show.posterUrl}
            alt={`${show.title} season ${show.userProgress.nextEpisode.season.number} poster`}
            className="h-full w-full"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="absolute left-2 top-2 text-sm text-white">
              Next: {show.userProgress.nextEpisode.season.number.toString().padStart(2, '0')}x
              {show.userProgress.nextEpisode.number.toString().padStart(2, '0')}
            </p>
          </div>
        </Link>
      </li>
    ))}
  </ul>
)

export const Success = ({ showsWatchlist }: CellSuccessProps<ShowsWatchlistQuery>) => {
  const now = new Date()

  const onAirShows = showsWatchlist.filter(
    (show) => show.userProgress.nextEpisode.airDate && isBefore(show.userProgress.nextEpisode.airDate, now)
  )
  const upcomingShows = showsWatchlist.filter(
    (show) => !show.userProgress.nextEpisode.airDate || isAfter(show.userProgress.nextEpisode.airDate, now)
  )

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">On Air</h2>
      <ShowsGrid shows={onAirShows} />

      <h2 className="text-3xl font-bold">Upcoming</h2>
      <ShowsGrid shows={upcomingShows} />
    </div>
  )
}
