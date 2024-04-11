import { Metadata } from '@redwoodjs/web'

import ToWatchMoviesCell from 'src/components/ToWatchMoviesCell'

const UserMoviesWatchlistPage = () => {
  return (
    <>
      <Metadata title="My Movies Watchlist" robots="noindex" />

      <h2 className="mb-4 text-2xl font-bold">My Movies Watchlist</h2>

      <ToWatchMoviesCell />
    </>
  )
}

export default UserMoviesWatchlistPage
