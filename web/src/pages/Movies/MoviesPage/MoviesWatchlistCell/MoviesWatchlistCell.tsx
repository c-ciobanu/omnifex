import { getTime, intlFormat, intlFormatDistance, isAfter, isBefore } from 'date-fns'
import { maxTime } from 'date-fns/constants'
import type { MoviesWatchlistQuery, MoviesWatchlistQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellFailureProps, CellSuccessProps, TypedDocumentNode } from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<MoviesWatchlistQuery, MoviesWatchlistQueryVariables> = gql`
  query MoviesWatchlistQuery {
    moviesWatchlist {
      id
      title
      tmdbId
      posterUrl
      releaseDate
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

interface MoviesGridProps {
  movies: MoviesWatchlistQuery['moviesWatchlist']
}

const MoviesGrid = ({ movies }: MoviesGridProps) => (
  <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
    {movies.map((movie) => (
      <li key={movie.id}>
        <Link to={routes.movie({ tmdbId: movie.tmdbId })} title={movie.title} className="group relative">
          <img src={movie.posterUrl} alt={`${movie.title} poster`} className="h-full w-full" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute left-2 top-2 text-sm text-white">
              <p>{movie.title}</p>
              {movie.releaseDate ? (
                <>
                  <p className="capitalize">{intlFormatDistance(movie.releaseDate, new Date())}</p>
                  <p className="capitalize">{intlFormat(movie.releaseDate)}</p>
                </>
              ) : null}
            </div>
          </div>
        </Link>
      </li>
    ))}
  </ul>
)

export const Success = ({ moviesWatchlist }: CellSuccessProps<MoviesWatchlistQuery, MoviesWatchlistQueryVariables>) => {
  const now = new Date()

  const onAirMovies = moviesWatchlist
    .filter((movie) => movie.releaseDate && isBefore(movie.releaseDate, now))
    .sort((a, b) => getTime(b.releaseDate) - getTime(a.releaseDate))
  const upcomingMovies = moviesWatchlist
    .filter((movie) => !movie.releaseDate || isAfter(movie.releaseDate, now))
    .sort((a, b) => {
      const aTime = a.releaseDate ? getTime(a.releaseDate) : maxTime
      const bTime = b.releaseDate ? getTime(b.releaseDate) : maxTime

      return aTime - bTime
    })

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">On Air</h2>
      <MoviesGrid movies={onAirMovies} />

      <h2 className="text-3xl font-bold">Upcoming</h2>
      <MoviesGrid movies={upcomingMovies} />
    </div>
  )
}
