import { Eye, EyeOff, ListMinus, ListPlus } from 'lucide-react'
import { MovieQuery } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import { cn } from 'src/lib/utils'
import { QUERY as MovieCellQuery } from 'src/pages/Movies/MoviePage/MovieCell/MovieCell'

type ActionsProps = {
  movie: MovieQuery['movie']
}

const WATCH_MOVIE_MUTATION = gql`
  mutation WatchMovieMutation($id: Int!) {
    watchMovie(id: $id) {
      id
    }
  }
`

const UNWATCH_MOVIE_MUTATION = gql`
  mutation UnwatchMovieMutation($id: Int!) {
    unwatchMovie(id: $id) {
      id
    }
  }
`

const WATCHLIST_MOVIE_MUTATION = gql`
  mutation WatchlistMovieMutation($id: Int!) {
    watchlistMovie(id: $id) {
      id
    }
  }
`

const UNWATCHLIST_MOVIE_MUTATION = gql`
  mutation UnwatchlistMovieMutation($id: Int!) {
    unwatchlistMovie(id: $id) {
      id
    }
  }
`

const Actions = ({ movie }: ActionsProps) => {
  const { id, tmdbId, userInfo } = movie
  const { watched, inWatchlist } = userInfo

  const [createWatched, { loading: createWatchedLoading }] = useMutation(WATCH_MOVIE_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: MovieCellQuery, variables: { tmdbId } }],
  })
  const [deleteWatched, { loading: deleteWatchedLoading }] = useMutation(UNWATCH_MOVIE_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: MovieCellQuery, variables: { tmdbId } }],
  })
  const [createToWatch, { loading: createToWatchLoading }] = useMutation(WATCHLIST_MOVIE_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: MovieCellQuery, variables: { tmdbId } }],
  })
  const [deleteToWatch, { loading: deleteToWatchLoading }] = useMutation(UNWATCHLIST_MOVIE_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: MovieCellQuery, variables: { tmdbId } }],
  })

  const toggleWatchedStatus = () => {
    if (watched) {
      deleteWatched()
    } else {
      createWatched()
    }
  }

  const toggleToWatchStatus = () => {
    if (inWatchlist) {
      deleteToWatch()
    } else {
      createToWatch()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={toggleWatchedStatus}
        disabled={createWatchedLoading || deleteWatchedLoading}
        variant="outline"
        size="lg"
        className={cn(
          'h-12 justify-start gap-4 border-teal-500 px-2 text-base uppercase',
          watched
            ? 'bg-teal-500 text-white hover:border-teal-600 hover:bg-teal-600 hover:text-white'
            : 'text-teal-500 hover:bg-teal-500 hover:text-white'
        )}
      >
        {watched ? <Eye /> : <EyeOff />}
        <span>{watched ? 'Watched' : 'Set as watched'}</span>
      </Button>

      {watched ? null : (
        <Button
          onClick={toggleToWatchStatus}
          disabled={createToWatchLoading || deleteToWatchLoading}
          variant="outline"
          size="lg"
          className={cn(
            'h-12 justify-start gap-4 border-sky-500 px-2 text-base uppercase',
            inWatchlist
              ? 'bg-sky-500 text-white hover:border-sky-600 hover:bg-sky-600 hover:text-white'
              : 'text-sky-500 hover:bg-sky-500 hover:text-white'
          )}
        >
          {inWatchlist ? <ListPlus /> : <ListMinus />}
          <span>{inWatchlist ? 'Listed on watchlist' : 'Add to watchlist'}</span>
        </Button>
      )}
    </div>
  )
}

export default Actions
