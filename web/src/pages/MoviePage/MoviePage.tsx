import { MetaTags } from '@redwoodjs/web'

import MovieCell from 'src/components/MovieCell'

type MoviePageProps = {
  id: number
}

const MoviePage = ({ id }: MoviePageProps) => {
  return (
    <>
      <MetaTags title="Movie" description="Movie page" />

      <MovieCell id={id} />
    </>
  )
}

export default MoviePage
