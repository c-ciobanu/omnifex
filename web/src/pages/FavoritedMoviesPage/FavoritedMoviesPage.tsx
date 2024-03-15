import { Metadata } from '@redwoodjs/web'

import FavoritedMoviesCell from 'src/components/FavoritedMoviesCell'

const FavoritedMoviesPage = () => {
  return (
    <>
      <Metadata title="FavoritedMovies" description="FavoritedMovies page" />

      <h2 className="mb-4 text-2xl font-bold">My Favorites</h2>

      <FavoritedMoviesCell />
    </>
  )
}

export default FavoritedMoviesPage
