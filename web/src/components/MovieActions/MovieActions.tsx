import { faEye as faRegularEye, faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons'
import { faEye as faSolidEye, faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { UserMovie } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import { QUERY as MovieQuery } from 'src/components/MovieCell'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'src/components/Tooltip'

type MovieActionsProps = {
  id: number
  userState: UserMovie
}

const CREATE_FAVORITED_MOVIE = gql`
  mutation CreateFavoritedMovieMutation($input: CreateFavoritedMovieInput!) {
    createFavoritedMovie(input: $input) {
      id
    }
  }
`

const DELETE_FAVORITED_MOVIE = gql`
  mutation DeleteFavoritedMovieMutation($tmdbId: Int!) {
    deleteFavoritedMovie(tmdbId: $tmdbId) {
      id
    }
  }
`

const CREATE_WATCHED_MOVIE = gql`
  mutation CreateWatchedMovieMutation($input: CreateWatchedMovieInput!) {
    createWatchedMovie(input: $input) {
      id
    }
  }
`

const DELETE_WATCHED_MOVIE = gql`
  mutation DeleteWatchedMovieMutation($tmdbId: Int!) {
    deleteWatchedMovie(tmdbId: $tmdbId) {
      id
    }
  }
`

const MovieActions = ({ id, userState }: MovieActionsProps) => {
  const { favorited, watched } = userState

  const [createFavorited, { loading: createFavoritedLoading }] = useMutation(CREATE_FAVORITED_MOVIE, {
    variables: { input: { tmdbId: id } },
    refetchQueries: [{ query: MovieQuery, variables: { id } }],
  })
  const [deleteFavorited, { loading: deleteFavoritedLoading }] = useMutation(DELETE_FAVORITED_MOVIE, {
    variables: { tmdbId: id },
    refetchQueries: [{ query: MovieQuery, variables: { id } }],
  })
  const [createWatched, { loading: createWatchedLoading }] = useMutation(CREATE_WATCHED_MOVIE, {
    variables: { input: { tmdbId: id } },
    refetchQueries: [{ query: MovieQuery, variables: { id } }],
  })
  const [deleteWatched, { loading: deleteWatchedLoading }] = useMutation(DELETE_WATCHED_MOVIE, {
    variables: { tmdbId: id },
    refetchQueries: [{ query: MovieQuery, variables: { id } }],
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

  return (
    <div className="mb-6 flex justify-around bg-white py-4 shadow">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleWatchedStatus}
              disabled={createWatchedLoading || deleteWatchedLoading}
              className={clsx('icon-bg-light', watched && 'text-gray-700 hover:text-gray-300')}
            >
              <FontAwesomeIcon icon={watched ? faSolidEye : faRegularEye} fixedWidth />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{watched ? 'Remove from watched movies' : 'Set as watched'}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleFavoritedStatus}
              disabled={createFavoritedLoading || deleteFavoritedLoading}
              className={clsx('icon-bg-light', favorited && 'text-gray-700 hover:text-gray-300')}
            >
              <FontAwesomeIcon icon={favorited ? faSolidHeart : faRegularHeart} fixedWidth />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{favorited ? 'Remove from favorites' : 'Add to favorites'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default MovieActions
