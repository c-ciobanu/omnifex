import { Metadata } from '@redwoodjs/web'

import WatchlistedMoviesCell from 'src/components/WatchlistedMoviesCell'

const UserMoviesWatchlistPage = () => {
  return (
    <>
      <Metadata title="My Movies Watchlist" robots="noindex" />

      <h2 className="mb-4 text-2xl font-bold">My Movies Watchlist</h2>

      <WatchlistedMoviesCell />
    </>
  )
}

export default UserMoviesWatchlistPage
