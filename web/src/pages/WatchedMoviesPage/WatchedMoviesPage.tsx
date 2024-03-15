import { Metadata } from '@redwoodjs/web'

import WatchedMoviesCell from 'src/components/WatchedMoviesCell'

const WatchedMoviesPage = () => {
  return (
    <>
      <Metadata title="WatchedMovies" description="WatchedMovies page" />

      <h2 className="mb-4 text-2xl font-bold">My Watched Movies</h2>

      <WatchedMoviesCell />
    </>
  )
}

export default WatchedMoviesPage
