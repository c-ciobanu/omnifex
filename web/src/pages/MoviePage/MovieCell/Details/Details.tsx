import { Star } from 'lucide-react'
import { MovieQuery } from 'types/graphql'

export const formatMinutesToHoursAndMinutes = (minutes: number) => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60

  return `${h}h ${m}m`
}

type DetailsProps = {
  movie: MovieQuery['movie']
}

const Details = ({ movie }: DetailsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold">{movie.title}</h2>
      <q>{movie.tagline}</q>
      <h4 className="flex items-center text-gray-400">
        {movie.releaseDate.split('-')[0]}
        {' · '}
        {formatMinutesToHoursAndMinutes(movie.runtime)}
        {' ·  '}
        <Star className="mx-1 h-5 w-5 fill-yellow-300 text-yellow-300" />
        <span className="text-lg font-bold text-gray-900">{movie.rating}</span>/10
      </h4>

      <div className="mt-6 flex items-start gap-6">
        <img src={movie.posterUrl} alt={`${movie.title} poster`} className="w-1/4" />

        <div className="space-y-3">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {movie.genres.map((genre) => (
              <span
                key={genre}
                className="nline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
              >
                {genre}
              </span>
            ))}
          </div>
          <p>{movie.overview}</p>
        </div>
      </div>
    </div>
  )
}

export default Details
