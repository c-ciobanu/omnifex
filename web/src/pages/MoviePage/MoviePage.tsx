import { Metadata } from '@redwoodjs/web'

import MovieCell from 'src/components/MovieCell'

type MoviePageProps = {
  id: number
}

const MoviePage = ({ id }: MoviePageProps) => {
  return (
    <>
      <Metadata title="Movie" description="Movie page" />

      <MovieCell id={id} />
    </>
  )
}

export default MoviePage
