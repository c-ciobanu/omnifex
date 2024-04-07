import { Metadata } from '@redwoodjs/web'

import FavoritedMoviesCell from 'src/components/FavoritedMoviesCell'

const UserFavoriteMoviesPage = () => {
  return (
    <>
      <Metadata title="FavoritedMovies" description="FavoritedMovies page" />

      <h2 className="mb-4 text-2xl font-bold">My Favorite Movies</h2>

      <FavoritedMoviesCell />
    </>
  )
}

export default UserFavoriteMoviesPage
