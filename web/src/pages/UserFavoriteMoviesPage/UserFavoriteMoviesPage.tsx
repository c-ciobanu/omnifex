import { Metadata } from '@redwoodjs/web'

import FavoritedMoviesCell from 'src/components/FavoritedMoviesCell'

const UserFavoriteMoviesPage = () => {
  return (
    <>
      <Metadata title="My Favorite Movies" robots="noindex" />

      <h2 className="mb-4 text-2xl font-bold">My Favorite Movies</h2>

      <FavoritedMoviesCell />
    </>
  )
}

export default UserFavoriteMoviesPage
