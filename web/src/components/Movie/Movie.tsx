import { faEye as faRegularEye, faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons'
import { faEye as faSolidEye, faHeart as faSolidHeart, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DetailedMovie } from 'types/graphql'

import Tooltip from 'src/components/Tooltip'
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
  const [moviesStats, setMoviesStats] = useLocalStorage('moviesStats', {
    favorited: [],
    watched: [],
  })

  const userMovieStats = {
    isWatched: moviesStats.watched.includes(movie.id),
    isFavorited: moviesStats.favorited.includes(movie.id),
  }

  return (
    <>
      <div className="mb-4 flex justify-around bg-neutral-800 py-3 text-gray-400">
        <Tooltip content={userMovieStats.isWatched ? 'Remove from watched' : 'Set as watched'}>
          <button
            className="h-11 w-11 rounded-full bg-white text-xl"
            onClick={() =>
              setMoviesStats((prevState) => ({
                ...prevState,
                watched: userMovieStats.isWatched
                  ? prevState.watched.filter((el) => el !== movie.id)
                  : prevState.watched.concat(movie.id),
              }))
            }
          >
            <FontAwesomeIcon icon={userMovieStats.isWatched ? faSolidEye : faRegularEye} />
          </button>
        </Tooltip>

        <Tooltip content={userMovieStats.isFavorited ? 'Remove from favorites' : 'Set as favorite'}>
          <button
            className="h-11 w-11 rounded-full bg-white text-xl"
            onClick={() =>
              setMoviesStats((prevState) => ({
                ...prevState,
                favorited: userMovieStats.isFavorited
                  ? prevState.favorited.filter((el) => el !== movie.id)
                  : prevState.favorited.concat(movie.id),
              }))
            }
          >
            <FontAwesomeIcon icon={userMovieStats.isFavorited ? faSolidHeart : faRegularHeart} />
          </button>
        </Tooltip>
      </div>

      <h2 className="text-xl">{movie.title}</h2>
      <q>{movie.tagline}</q>
      <h4 className="text-gray-400">
        {movie.releaseYear} · {formatMinutesToHoursAndMinutes(movie.runtime)} ·{' '}
        <FontAwesomeIcon icon={faStar} className="text-yellow-300" />{' '}
        <span className="text-lg font-bold text-white">{movie.rating}</span>/10
      </h4>

      <div className="mt-4 flex items-start gap-4">
        <img src={movie.posterUrl} alt={`${movie.title} poster`} className="w-1/4" />

        <div className="space-y-2">
          <p>{movie.genres.join(', ')}</p>
          <p>{movie.overview}</p>
        </div>
      </div>
    </>
  )
}

export default Movie
