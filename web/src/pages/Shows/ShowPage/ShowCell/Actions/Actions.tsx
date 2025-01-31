import { Eye, EyeOff, ListMinus, ListPlus } from 'lucide-react'
import { ShowQuery } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import { cn } from 'src/lib/utils'

import { QUERY as ShowCellQuery } from '../ShowCell'

type ActionsProps = {
  show: ShowQuery['show']
}

const WATCH_SHOW_MUTATION = gql`
  mutation WatchShowMutation($id: Int!) {
    watchShow(id: $id) {
      id
    }
  }
`

const UNWATCH_SHOW_MUTATION = gql`
  mutation UnwatchShowMutation($id: Int!) {
    unwatchShow(id: $id) {
      count
    }
  }
`

const WATCHLIST_SHOW_MUTATION = gql`
  mutation WatchlistShowMutation($id: Int!) {
    watchlistShow(id: $id) {
      id
    }
  }
`

const UNWATCHLIST_SHOW_MUTATION = gql`
  mutation UnwatchlistShowMutation($id: Int!) {
    unwatchlistShow(id: $id) {
      id
    }
  }
`

const ABANDON_SHOW_MUTATION = gql`
  mutation AbandonShowMutation($id: Int!) {
    abandonShow(id: $id) {
      id
    }
  }
`

const UNABANDON_SHOW_MUTATION = gql`
  mutation UnabandonShowMutation($id: Int!) {
    unabandonShow(id: $id) {
      id
    }
  }
`

const Actions = ({ show }: ActionsProps) => {
  const { id, tmdbId, userProgress } = show
  const { watched, watchedEpisodes, inWatchlist, abandoned } = userProgress

  const [createWatched, { loading: createWatchedLoading }] = useMutation(WATCH_SHOW_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: ShowCellQuery, variables: { tmdbId } }],
  })
  const [deleteWatched, { loading: deleteWatchedLoading }] = useMutation(UNWATCH_SHOW_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: ShowCellQuery, variables: { tmdbId } }],
  })
  const [createToWatch, { loading: createToWatchLoading }] = useMutation(WATCHLIST_SHOW_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: ShowCellQuery, variables: { tmdbId } }],
  })
  const [deleteToWatch, { loading: deleteToWatchLoading }] = useMutation(UNWATCHLIST_SHOW_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: ShowCellQuery, variables: { tmdbId } }],
  })
  const [createAbandoned, { loading: createAbandonedLoading }] = useMutation(ABANDON_SHOW_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: ShowCellQuery, variables: { tmdbId } }],
  })
  const [deleteAbandoned, { loading: deleteAbandonedLoading }] = useMutation(UNABANDON_SHOW_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: ShowCellQuery, variables: { tmdbId } }],
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

  const toggleAbandonedStatus = () => {
    if (abandoned) {
      deleteAbandoned()
    } else {
      createAbandoned()
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

      {watched || watchedEpisodes > 0 || abandoned ? null : (
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

      {watched || inWatchlist ? null : (
        <Button
          onClick={toggleAbandonedStatus}
          disabled={createAbandonedLoading || deleteAbandonedLoading}
          variant="outline"
          size="lg"
          className={cn(
            'h-12 justify-start gap-4 border-indigo-500 px-2 text-base uppercase',
            abandoned
              ? 'bg-indigo-500 text-white hover:border-indigo-600 hover:bg-indigo-600 hover:text-white'
              : 'text-indigo-500 hover:bg-indigo-500 hover:text-white'
          )}
        >
          {abandoned ? <ListPlus /> : <ListMinus />}
          <span>{abandoned ? 'Abandoned' : 'Set as abandoned'}</span>
        </Button>
      )}
    </div>
  )
}

export default Actions
