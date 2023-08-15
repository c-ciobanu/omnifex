import { useState } from 'react'

import { faEye as faRegularEye, faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons'
import { faEye as faSolidEye, faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Tooltip from 'src/components/Tooltip'
import WarningDialog from 'src/components/WarningDialog'
import { useLocalStorage } from 'src/hooks/useLocalStorage'

type MovieStatusesControlsProps = {
  id: number
}

const MovieStatusesControls = ({ id }: MovieStatusesControlsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [movieStatuses, setMovieStatuses] = useLocalStorage('movieStatuses', {
    favorited: [],
    watched: [],
  })
  const [hideLocalStorageWarning, setHideLocalStorageWarning] = useLocalStorage('hideLocalStorageWarning', false)

  const userMovieStatuses = {
    isWatched: movieStatuses.watched.includes(id),
    isFavorited: movieStatuses.favorited.includes(id),
  }

  return (
    <>
      <Tooltip content={userMovieStatuses.isWatched ? 'Remove from watched' : 'Set as watched'}>
        <button
          className="h-11 w-11 rounded-full bg-white text-xl"
          onClick={() => {
            setMovieStatuses((prevState) => ({
              ...prevState,
              watched: userMovieStatuses.isWatched
                ? prevState.watched.filter((el) => el !== id)
                : prevState.watched.concat(id),
            }))

            if (!hideLocalStorageWarning) {
              setIsDialogOpen(true)
            }
          }}
        >
          <FontAwesomeIcon icon={userMovieStatuses.isWatched ? faSolidEye : faRegularEye} />
        </button>
      </Tooltip>

      <Tooltip content={userMovieStatuses.isFavorited ? 'Remove from favorites' : 'Set as favorite'}>
        <button
          className="h-11 w-11 rounded-full bg-white text-xl"
          onClick={() => {
            setMovieStatuses((prevState) => ({
              ...prevState,
              favorited: userMovieStatuses.isFavorited
                ? prevState.favorited.filter((el) => el !== id)
                : prevState.favorited.concat(id),
            }))

            if (!hideLocalStorageWarning) {
              setIsDialogOpen(true)
            }
          }}
        >
          <FontAwesomeIcon icon={userMovieStatuses.isFavorited ? faSolidHeart : faRegularHeart} />
        </button>
      </Tooltip>

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

export default MovieStatusesControls
