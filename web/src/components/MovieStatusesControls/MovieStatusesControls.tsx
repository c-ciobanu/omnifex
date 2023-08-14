import { faEye as faRegularEye, faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons'
import { faEye as faSolidEye, faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Tooltip from 'src/components/Tooltip'
import { useLocalStorage } from 'src/hooks/useLocalStorage'

type MovieStatusesControlsProps = {
  id: number
}

const MovieStatusesControls = ({ id }: MovieStatusesControlsProps) => {
  const [movieStatuses, setMovieStatuses] = useLocalStorage('movieStatuses', {
    favorited: [],
    watched: [],
  })

  const userMovieStatuses = {
    isWatched: movieStatuses.watched.includes(id),
    isFavorited: movieStatuses.favorited.includes(id),
  }

  return (
    <>
      <Tooltip content={userMovieStatuses.isWatched ? 'Remove from watched' : 'Set as watched'}>
        <button
          className="h-11 w-11 rounded-full bg-white text-xl"
          onClick={() =>
            setMovieStatuses((prevState) => ({
              ...prevState,
              watched: userMovieStatuses.isWatched
                ? prevState.watched.filter((el) => el !== id)
                : prevState.watched.concat(id),
            }))
          }
        >
          <FontAwesomeIcon icon={userMovieStatuses.isWatched ? faSolidEye : faRegularEye} />
        </button>
      </Tooltip>

      <Tooltip content={userMovieStatuses.isFavorited ? 'Remove from favorites' : 'Set as favorite'}>
        <button
          className="h-11 w-11 rounded-full bg-white text-xl"
          onClick={() =>
            setMovieStatuses((prevState) => ({
              ...prevState,
              favorited: userMovieStatuses.isFavorited
                ? prevState.favorited.filter((el) => el !== id)
                : prevState.favorited.concat(id),
            }))
          }
        >
          <FontAwesomeIcon icon={userMovieStatuses.isFavorited ? faSolidHeart : faRegularHeart} />
        </button>
      </Tooltip>
    </>
  )
}

export default MovieStatusesControls
