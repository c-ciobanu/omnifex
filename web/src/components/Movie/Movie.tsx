import {
  faEye as faRegularEye,
  faHeart as faRegularHeart,
} from '@fortawesome/free-regular-svg-icons'
import {
  faEye as faSolidEye,
  faHeart as faSolidHeart,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DetailedMovie } from 'types/graphql'

import { useLocalStorage } from 'src/hooks/useLocalStorage/useLocalStorage'

export const formatMinutesToHoursAndMinutes = (minutes: number) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  return `${h}h ${m}m`
}

type MovieProps = {
  movie: DetailedMovie
}

const Movie = ({ movie }: MovieProps) => {
  const [userMovieStats, setUserMovieStats] = useLocalStorage(
    movie.id.toString(),
    { isFavorited: false, isWatched: false }
  )

  return (
    <>
      <h2 className="text-xl">{movie.title}</h2>
      <q>{movie.tagline}</q>
      <h4 className="text-gray-400">
        {movie.releaseYear} · {formatMinutesToHoursAndMinutes(movie.runtime)} ·{' '}
        <FontAwesomeIcon icon={faStar} className="text-yellow-300" />{' '}
        <span className="text-lg font-bold text-white">{movie.rating}</span>/10
      </h4>

      <div className="mt-4 flex items-start gap-4">
        <img
          src={movie.posterUrl}
          alt={`${movie.title} poster`}
          className="w-1/4"
        />

        <div className="space-y-2">
          <p>{movie.genres.join(', ')}</p>
          <p>{movie.overview}</p>

          <div className="space-x-4">
            <button
              className="h-11 w-11 rounded-full bg-neutral-800 text-xl"
              onClick={() =>
                setUserMovieStats((prevState) => ({
                  ...prevState,
                  isWatched: !prevState.isWatched,
                }))
              }
            >
              <FontAwesomeIcon
                icon={userMovieStats.isWatched ? faSolidEye : faRegularEye}
              />
            </button>

            <button
              className="h-11 w-11 rounded-full bg-neutral-800 text-xl"
              onClick={() =>
                setUserMovieStats((prevState) => ({
                  ...prevState,
                  isFavorited: !prevState.isFavorited,
                }))
              }
            >
              <FontAwesomeIcon
                icon={
                  userMovieStats.isFavorited ? faSolidHeart : faRegularHeart
                }
              />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Movie
