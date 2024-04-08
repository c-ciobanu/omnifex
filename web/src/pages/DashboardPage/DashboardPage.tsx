import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import FavoritedBooksCell from 'src/components/FavoritedBooksCell'
import FavoritedMoviesCell from 'src/components/FavoritedMoviesCell'
import ReadBooksCell from 'src/components/ReadBooksCell'
import ToReadBooksCell from 'src/components/ToReadBooksCell'
import WatchedMoviesCell from 'src/components/WatchedMoviesCell'
import WatchlistedMoviesCell from 'src/components/WatchlistedMoviesCell'

const DashboardPage = () => {
  return (
    <>
      <Metadata title="Dashboard" robots="noindex" />

      <div className="flex flex-col divide-y">
        <div className="space-y-2 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Recently added movies to watchlist</h2>
            <Link
              to={routes.userMoviesWatchlist()}
              className="flex items-center gap-1 text-xs uppercase hover:text-black/50"
            >
              <span>See all</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>

          <WatchlistedMoviesCell numberToShow={4} />
        </div>

        <div className="space-y-2 pb-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Recently watched movies</h2>
            <Link
              to={routes.userWatchedMovies()}
              className="flex items-center gap-1 text-xs uppercase hover:text-black/50"
            >
              <span>See all</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>

          <WatchedMoviesCell numberToShow={4} />
        </div>

        <div className="space-y-2 pb-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Recently favorited movies</h2>
            <Link
              to={routes.userFavoriteMovies()}
              className="flex items-center gap-1 text-xs uppercase hover:text-black/50"
            >
              <span>See all</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>

          <FavoritedMoviesCell numberToShow={4} />
        </div>

        <div className="space-y-2 pb-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Recently added books to reading list</h2>
            <Link
              to={routes.userBooksReadingList()}
              className="flex items-center gap-1 text-xs uppercase hover:text-black/50"
            >
              <span>See all</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>

          <ToReadBooksCell numberToShow={4} />
        </div>

        <div className="space-y-2 pb-4 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Recently read books</h2>
            <Link to={routes.userReadBooks()} className="flex items-center gap-1 text-xs uppercase hover:text-black/50">
              <span>See all</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>

          <ReadBooksCell numberToShow={4} />
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Recently favorited books</h2>
            <Link
              to={routes.userFavoriteBooks()}
              className="flex items-center gap-1 text-xs uppercase hover:text-black/50"
            >
              <span>See all</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>

          <FavoritedBooksCell numberToShow={4} />
        </div>
      </div>
    </>
  )
}

export default DashboardPage
