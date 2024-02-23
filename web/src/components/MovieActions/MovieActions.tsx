import { useState } from 'react'

import { faEye as faRegularEye, faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons'
import { faEye as faSolidEye, faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { UserMovie } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { QUERY as MovieQuery } from 'src/components/MovieCell'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'src/components/Tooltip'
import WarningDialog from 'src/components/WarningDialog'
import { useLocalMovies } from 'src/hooks/useLocalMovies/useLocalMovies'
import { useLocalStorage } from 'src/hooks/useLocalStorage/useLocalStorage'

type MovieActionsProps = {
  id: number
  statuses?: UserMovie
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

const MovieActions = ({ id, statuses }: MovieActionsProps) => {
  const { isAuthenticated } = useAuth()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { localMovies, setLocalMovies } = useLocalMovies()
  const [hideLocalStorageWarning, setHideLocalStorageWarning] = useLocalStorage('hideLocalStorageWarning', false)
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
    if (isAuthenticated) {
      if (favorited) {
        deleteFavorited()
      } else {
        createFavorited()
      }
    } else {
      setLocalMovies((prevState) => ({
        ...prevState,
        favorited: favorited ? prevState.favorited.filter((el) => el !== id) : prevState.favorited.concat(id),
      }))

      if (!hideLocalStorageWarning) {
        setIsDialogOpen(true)
      }
    }
  }

  const toggleWatchedStatus = () => {
    if (isAuthenticated) {
      if (watched) {
        deleteWatched()
      } else {
        createWatched()
      }
    } else {
      setLocalMovies((prevState) => ({
        ...prevState,
        watched: watched ? prevState.watched.filter((el) => el !== id) : prevState.watched.concat(id),
      }))

      if (!hideLocalStorageWarning) {
        setIsDialogOpen(true)
      }
    }
  }

  const { favorited = localMovies.favorited.includes(id), watched = localMovies.watched.includes(id) } = statuses ?? {}

  return (
    <>
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
            <p>{watched ? 'Remove from watched' : 'Set as watched'}</p>
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
            <p>{favorited ? 'Remove from favorites' : 'Set as favorite'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <WarningDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onContinue={setHideLocalStorageWarning}
        title="Data Storage Limitation: The saved data will only be accessible on this specific browser"
        description="Please note that the action you just performed will be saved within your current browser only. It will not be accessible from another browser or device unless you log in or sign up. To ensure seamless access to the platform across multiple devices, kindly create an account or log in to your existing account."
      />
    </>
  )
}

export default MovieActions
