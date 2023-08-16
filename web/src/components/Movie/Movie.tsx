import { faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { DetailedMovie } from 'types/graphql'

export const formatMinutesToHoursAndMinutes = (minutes: number) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  return `${h}h ${m}m`
}

type MovieProps = {
  movie: DetailedMovie
}

const Movie = ({ movie }: MovieProps) => {
  return (
    <>
      <h2 className="text-2xl font-bold">{movie.title}</h2>
      <q>{movie.tagline}</q>
      <h4 className="text-gray-400">
        {movie.releaseYear} · {formatMinutesToHoursAndMinutes(movie.runtime)} ·{' '}
        <FontAwesomeIcon icon={faStar} className="text-yellow-300" />{' '}
        <span className="text-lg font-bold text-gray-900">{movie.rating}</span>/10
      </h4>

      <div className="mt-6 flex items-start gap-6">
        <img src={movie.posterUrl} alt={`${movie.title} poster`} className="w-1/4" />

        <div className="space-y-3">
          <p>{movie.genres.join(', ')}</p>
          <p>{movie.overview}</p>
        </div>
      </div>
    </>
  )
}

export default Movie
