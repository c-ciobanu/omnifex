import {
  faEye as faRegularEye,
  faHeart as faRegularHeart,
  faRectangleList as faRegularRectangleList,
} from '@fortawesome/free-regular-svg-icons'
import {
  faEye as faSolidEye,
  faHeart as faSolidHeart,
  faRectangleList as faSolidRectangleList,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { MovieQuery } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'src/components/Tooltip'
import { QUERY as MovieCellQuery } from 'src/pages/MoviePage/MovieCell/MovieCell'

type ActionsProps = {
  movie: MovieQuery['movie']
}

const CREATE_FAVORITED_MOVIE = gql`
  mutation CreateFavoritedMovieMutation($input: CreateUserMovieInput!) {
    createFavoritedMovie(input: $input) {
      id
    }
  }
`

const DELETE_FAVORITED_MOVIE = gql`
  mutation DeleteFavoritedMovieMutation($movieId: Int!) {
    deleteFavoritedMovie(movieId: $movieId) {
      id
    }
  }
`

const CREATE_WATCHED_MOVIE = gql`
  mutation CreateWatchedMovieMutation($input: CreateUserMovieInput!) {
    createWatchedMovie(input: $input) {
      id
    }
  }
`

const DELETE_WATCHED_MOVIE = gql`
  mutation DeleteWatchedMovieMutation($movieId: Int!) {
    deleteWatchedMovie(movieId: $movieId) {
      id
    }
  }
`

const CREATE_TO_WATCH_MOVIE = gql`
  mutation CreateToWatchMovieMutation($input: CreateUserMovieInput!) {
    createToWatchMovie(input: $input) {
      id
    }
  }
`

const DELETE_TO_WATCH_MOVIE = gql`
  mutation DeleteToWatchMovieMutation($movieId: Int!) {
    deleteToWatchMovie(movieId: $movieId) {
      id
    }
  }
`

const Actions = ({ movie }: ActionsProps) => {
  const { id: movieId, tmdbId, userInfo } = movie
  const { favorited, watched, inWatchlist } = userInfo

  const [createFavorited, { loading: createFavoritedLoading }] = useMutation(CREATE_FAVORITED_MOVIE, {
    variables: { input: { movieId } },
    refetchQueries: [{ query: MovieCellQuery, variables: { tmdbId } }],
  })
  const [deleteFavorited, { loading: deleteFavoritedLoading }] = useMutation(DELETE_FAVORITED_MOVIE, {
    variables: { movieId },
    refetchQueries: [{ query: MovieCellQuery, variables: { tmdbId } }],
  })
  const [createWatched, { loading: createWatchedLoading }] = useMutation(CREATE_WATCHED_MOVIE, {
    variables: { input: { movieId } },
    refetchQueries: [{ query: MovieCellQuery, variables: { tmdbId } }],
  })
  const [deleteWatched, { loading: deleteWatchedLoading }] = useMutation(DELETE_WATCHED_MOVIE, {
    variables: { movieId },
    refetchQueries: [{ query: MovieCellQuery, variables: { tmdbId } }],
  })
  const [createToWatch, { loading: createToWatchLoading }] = useMutation(CREATE_TO_WATCH_MOVIE, {
    variables: { input: { movieId } },
    refetchQueries: [{ query: MovieCellQuery, variables: { tmdbId } }],
  })
  const [deleteToWatch, { loading: deleteToWatchLoading }] = useMutation(DELETE_TO_WATCH_MOVIE, {
    variables: { movieId },
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleWatchedStatus}
              disabled={createWatchedLoading || deleteWatchedLoading}
              className={clsx(
                'flex items-center gap-2 rounded-sm border border-teal-500 px-2 py-3 uppercase',
                watched
                  ? 'bg-teal-500 text-white hover:border-teal-600 hover:bg-teal-600'
                  : 'text-teal-500 hover:bg-teal-500 hover:text-white'
              )}
            >
              <FontAwesomeIcon icon={watched ? faSolidEye : faRegularEye} className="text-3xl" />
              <span className="whitespace-nowrap font-medium">{watched ? 'Watched' : 'Set as watched'}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{watched ? 'Remove from watched movies' : 'Set as watched'}</p>
          </TooltipContent>
        </Tooltip>

        {watched ? null : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleToWatchStatus}
                disabled={createToWatchLoading || deleteToWatchLoading}
                className={clsx(
                  'flex items-center gap-2 rounded-sm border border-sky-500 px-2 py-3 uppercase',
                  inWatchlist
                    ? 'bg-sky-500 text-white hover:border-sky-600 hover:bg-sky-600'
                    : 'text-sky-500 hover:bg-sky-500 hover:text-white'
                )}
              >
                <FontAwesomeIcon
                  icon={inWatchlist ? faSolidRectangleList : faRegularRectangleList}
                  className="text-3xl"
                />
                <span className="whitespace-nowrap font-medium">
                  {inWatchlist ? 'Listed on watchlist' : 'Add to watchlist'}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{inWatchlist ? 'Remove from movies watchlist' : 'Add to watchlist'}</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleFavoritedStatus}
              disabled={createFavoritedLoading || deleteFavoritedLoading}
              className={clsx(
                'flex items-center gap-2 rounded-sm border border-red-500 px-2 py-3 uppercase',
                favorited
                  ? 'bg-red-500 text-white hover:border-red-600 hover:bg-red-600'
                  : 'text-red-500 hover:bg-red-500 hover:text-white'
              )}
            >
              <FontAwesomeIcon icon={favorited ? faSolidHeart : faRegularHeart} className="text-3xl" />
              <span className="whitespace-nowrap font-medium">{favorited ? 'Favorited' : 'Add to favorites'}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent className="w-full">
            <p>{favorited ? 'Remove from favorites' : 'Add to favorites'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default Actions
