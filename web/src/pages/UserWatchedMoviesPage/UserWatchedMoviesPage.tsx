import { Metadata } from '@redwoodjs/web'

import WatchedMoviesCell from 'src/components/WatchedMoviesCell'

const UserWatchedMoviesPage = () => {
  return (
    <>
      <Metadata title="Movies I&#39;ve Seen" robots="noindex" />

      <h2 className="mb-4 text-2xl font-bold">Movies I&#39;ve Seen</h2>

      <WatchedMoviesCell />
    </>
  )
}

export default UserWatchedMoviesPage
