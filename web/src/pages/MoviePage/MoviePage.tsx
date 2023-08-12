import { MetaTags } from '@redwoodjs/web'

import MovieCell from 'src/components/MovieCell'

type MoviePageProps = {
  id: number
}

const MoviePage = ({ id }: MoviePageProps) => {
  return (
    <>
      <MetaTags title="Movie" description="Movie page" />

      <div className="p-4">
        <MovieCell id={id} />
      </div>
    </>
  )
}

export default MoviePage
