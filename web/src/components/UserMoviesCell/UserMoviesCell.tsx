import type { UserMoviesQuery } from 'types/graphql'

import { Link } from '@redwoodjs/router'
import { routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query UserMoviesQuery {
    favoriteMovies(input: { take: 3 }) {
      id
      title
      tmdbId
      posterUrl
    }
    watchedMovies(input: { take: 3 }) {
      id
      title
      tmdbId
      posterUrl
    }
    moviesWatchlist(input: { take: 3 }) {
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

export const Success = ({ favoriteMovies, watchedMovies, moviesWatchlist }: CellSuccessProps<UserMoviesQuery>) => {
  return (
    <div className="flex flex-col divide-y">
      <div className="space-y-2 pb-4">
        <h2 className="font-medium">Recently added movies to watchlist</h2>

        <ul className="flex gap-6">
          {moviesWatchlist.map((movie) => (
            <li key={movie.id}>
              <Link to={routes.movie({ tmdbId: movie.tmdbId })} title={movie.title}>
                <img src={movie.posterUrl} alt={`${movie.title} poster`} className="h-36 sm:h-52" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2 pb-4 pt-2">
        <h2 className="font-medium">Recently watched movies</h2>

        <ul className="flex gap-6">
          {watchedMovies.map((movie) => (
            <li key={movie.id}>
              <Link to={routes.movie({ tmdbId: movie.tmdbId })} title={movie.title}>
                <img src={movie.posterUrl} alt={`${movie.title} poster`} className="h-36 sm:h-52" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2 pt-2">
        <h2 className="font-medium">Recently favorited movies</h2>

        <ul className="flex gap-6">
          {favoriteMovies.map((movie) => (
            <li key={movie.id}>
              <Link to={routes.movie({ tmdbId: movie.tmdbId })} title={movie.title}>
                <img src={movie.posterUrl} alt={`${movie.title} poster`} className="h-36 sm:h-52" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
