import { Metadata } from '@redwoodjs/web'

import FavoritedBooksCell from 'src/components/FavoritedBooksCell'

const UserFavoriteBooksPage = () => {
  return (
    <>
      <Metadata title="UserFavoriteBooksPage" description="FavoritedMovies page" />

      <h2 className="mb-4 text-2xl font-bold">My Favorite Books</h2>

      <FavoritedBooksCell />
    </>
  )
}

export default UserFavoriteBooksPage
