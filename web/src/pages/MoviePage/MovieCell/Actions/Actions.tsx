import { Eye, EyeOff, Heart, HeartOff, ListMinus, ListPlus } from 'lucide-react'
import { MovieQuery } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import { cn } from 'src/lib/utils'
import { QUERY as MovieCellQuery } from 'src/pages/MoviePage/MovieCell/MovieCell'

type ActionsProps = {
  movie: MovieQuery['movie']
}

const CREATE_USER_MOVIE = gql`
  mutation CreateUserMovieMutation($input: CreateUserMovieInput!) {
    createUserMovie(input: $input) {
      id
    }
  }
`

const DELETE_USER_MOVIE = gql`
  mutation DeleteUserMovieMutation($movieId: Int!, $type: UserMovieType!) {
    deleteUserMovie(movieId: $movieId, type: $type) {
      id
    }
  }
`

const Actions = ({ movie }: ActionsProps) => {
  const { id: movieId, tmdbId, userInfo } = movie
  const { favorited, watched, inWatchlist } = userInfo

  const [createFavorited, { loading: createFavoritedLoading }] = useMutation(CREATE_USER_MOVIE, {
    variables: { input: { movieId, type: 'FAVORITED' } },
    refetchQueries: [{ query: MovieCellQuery, variables: { tmdbId } }],
  })
  const [deleteFavorited, { loading: deleteFavoritedLoading }] = useMutation(DELETE_USER_MOVIE, {
    variables: { movieId, type: 'FAVORITED' },
    refetchQueries: [{ query: MovieCellQuery, variables: { tmdbId } }],
  })
  const [createWatched, { loading: createWatchedLoading }] = useMutation(CREATE_USER_MOVIE, {
    variables: { input: { movieId, type: 'WATCHED' } },
    refetchQueries: [{ query: MovieCellQuery, variables: { tmdbId } }],
  })
  const [deleteWatched, { loading: deleteWatchedLoading }] = useMutation(DELETE_USER_MOVIE, {
    variables: { movieId, type: 'WATCHED' },
    refetchQueries: [{ query: MovieCellQuery, variables: { tmdbId } }],
  })
  const [createToWatch, { loading: createToWatchLoading }] = useMutation(CREATE_USER_MOVIE, {
    variables: { input: { movieId, type: 'TO_WATCH' } },
    refetchQueries: [{ query: MovieCellQuery, variables: { tmdbId } }],
  })
  const [deleteToWatch, { loading: deleteToWatchLoading }] = useMutation(DELETE_USER_MOVIE, {
    variables: { movieId, type: 'TO_WATCH' },
    refetchQueries: [{ query: MovieCellQuery, variables: { tmdbId } }],
  })

  const toggleFavoritedStatus = () => {
    if (favorited) {
      deleteFavorited()
    } else {
      createFavorited()
    }
  }

  const toggleWatchedStatus = () => {
    if (watched) {
      deleteWatched()
    } else {
      createWatched()
    }
  }

  const toggleToWatchStatus = () => {
    if (inWatchlist) {
      deleteToWatch()
    } else {
      createToWatch()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={toggleWatchedStatus}
        disabled={createWatchedLoading || deleteWatchedLoading}
        className={cn(
          'flex items-center gap-4 rounded-sm border border-teal-500 px-2 py-3 uppercase',
          watched
            ? 'bg-teal-500 text-white hover:border-teal-600 hover:bg-teal-600'
            : 'text-teal-500 hover:bg-teal-500 hover:text-white'
        )}
      >
        {watched ? <Eye /> : <EyeOff />}
        <span className="whitespace-nowrap font-medium">{watched ? 'Watched' : 'Set as watched'}</span>
      </button>

      {watched ? null : (
        <button
          onClick={toggleToWatchStatus}
          disabled={createToWatchLoading || deleteToWatchLoading}
          className={cn(
            'flex items-center gap-4 rounded-sm border border-sky-500 px-2 py-3 uppercase',
            inWatchlist
              ? 'bg-sky-500 text-white hover:border-sky-600 hover:bg-sky-600'
              : 'text-sky-500 hover:bg-sky-500 hover:text-white'
          )}
        >
          {inWatchlist ? <ListPlus /> : <ListMinus />}
          <span className="whitespace-nowrap font-medium">
            {inWatchlist ? 'Listed on watchlist' : 'Add to watchlist'}
          </span>
        </button>
      )}

      <button
        onClick={toggleFavoritedStatus}
        disabled={createFavoritedLoading || deleteFavoritedLoading}
        className={cn(
          'flex items-center gap-4 rounded-sm border border-red-500 px-2 py-3 uppercase',
          favorited
            ? 'bg-red-500 text-white hover:border-red-600 hover:bg-red-600'
            : 'text-red-500 hover:bg-red-500 hover:text-white'
        )}
      >
        {favorited ? <Heart /> : <HeartOff />}
        <span className="whitespace-nowrap font-medium">{favorited ? 'Favorited' : 'Add to favorites'}</span>
      </button>
    </div>
  )
}

export default Actions
