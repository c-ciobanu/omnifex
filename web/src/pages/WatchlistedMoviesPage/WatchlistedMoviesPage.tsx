import { Metadata } from '@redwoodjs/web'

import WatchlistedMoviesCell from 'src/components/WatchlistedMoviesCell'

const WatchlistedMoviesPage = () => {
  return (
    <>
      <Metadata title="WatchlistedMovies" description="WatchlistedMovies page" />

      <h2 className="mb-4 text-2xl font-bold">My Watchlist</h2>

      <WatchlistedMoviesCell />
    </>
  )
}

export default WatchlistedMoviesPage
