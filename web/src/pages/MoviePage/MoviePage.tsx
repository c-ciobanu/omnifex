import { Metadata } from '@redwoodjs/web'

import MovieCell from 'src/components/MovieCell'

type MoviePageProps = {
  tmdbId: number
}

const MoviePage = ({ tmdbId }: MoviePageProps) => {
  return (
    <>
      <Metadata title="Movie" description="Movie page" />

      <MovieCell tmdbId={tmdbId} />
    </>
  )
}

export default MoviePage
