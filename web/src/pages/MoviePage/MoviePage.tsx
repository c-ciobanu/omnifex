import MovieCell from './MovieCell'

type MoviePageProps = {
  tmdbId: number
}

const MoviePage = ({ tmdbId }: MoviePageProps) => {
  return <MovieCell tmdbId={tmdbId} />
}

export default MoviePage
