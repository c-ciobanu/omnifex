import { Metadata } from '@redwoodjs/web'

import MovieListsCell from './MovieListsCell'

const MoviesDashboardPage = () => {
  return (
    <>
      <Metadata title="Movies Dashboard" robots="noindex" />

      <MovieListsCell />
    </>
  )
}

export default MoviesDashboardPage
