import { useMutation } from '@apollo/client'
import { CircleCheck, Star } from 'lucide-react'
import type { ShowQuery } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { type CellFailureProps, type CellSuccessProps, Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { Button } from 'src/components/ui/button'
import { cn } from 'src/lib/utils'

import Actions from './Actions'

export const QUERY = gql`
  query ShowQuery($tmdbId: Int!) {
    show(tmdbId: $tmdbId) {
      id
      creators
      genres
      originalTitle
      overview
      posterUrl
      rating
      tagline
      title
      tmdbId
      seasons {
        id
        number
        posterUrl
        userProgress {
          watched
        }
      }
      episodes {
        id
      }
      userProgress {
        watched
        watchedEpisodes
        watchedPercentage
        inWatchlist
        abandoned
      }
    }
  }
`

const WATCH_SEASON_MUTATION = gql`
  mutation WatchSeasonMutation($id: Int!) {
    watchSeason(id: $id) {
      id
    }
  }
`

const UNWATCH_SEASON_MUTATION = gql`
  mutation UnwatchSeasonMutation($id: Int!) {
    unwatchSeason(id: $id) {
      count
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ show, tmdbId }: CellSuccessProps<ShowQuery> & { tmdbId: number }) => {
  const { isAuthenticated } = useAuth()

  const [watchSeason] = useMutation(WATCH_SEASON_MUTATION, {
    refetchQueries: [{ query: QUERY, variables: { tmdbId } }],
  })
  const [unwatchSeason] = useMutation(UNWATCH_SEASON_MUTATION, {
    refetchQueries: [{ query: QUERY, variables: { tmdbId } }],
  })

  function toggleWatchSeason(seasonId, watched) {
    if (watched) {
      unwatchSeason({ variables: { id: seasonId } })
    } else {
      watchSeason({ variables: { id: seasonId } })
    }
  }

  return (
    <>
      <Metadata title={show.title} description={show.overview} />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div>
          <h2 className="text-2xl font-bold">{show.title}</h2>

          {show.tagline ? <q>{show.tagline}</q> : null}

          {show.originalTitle !== show.title ? <p>Original title: {show.originalTitle}</p> : null}

          <p>Created by: {show.creators.join(', ')}</p>

          <p className="flex items-center text-gray-400">
            <Star className="mx-1 h-5 w-5 fill-yellow-300 text-yellow-300" />
            <span className="font-medium text-gray-900">{show.rating}</span>/10
          </p>

          <div className="mt-6 flex items-start gap-6">
            <img src={show.posterUrl} alt={`${show.title} poster`} className="w-1/4" />

            <div className="space-y-3">
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {show.genres.map((genre) => (
                  <span
                    key={genre}
                    className="nline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <p className="prose max-w-none">{show.overview}</p>
            </div>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="lg:w-72 lg:flex-shrink-0">
            <Actions show={show} />
          </div>
        ) : null}
      </div>

      <div className="mt-6 space-y-6">
        <h4 className="text-lg font-semibold">{show.seasons.length} Seasons</h4>

        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {show.seasons.map((season) => (
            <li key={season.id}>
              <Link
                to={routes.season({ tmdbId: show.tmdbId, number: season.number })}
                title={`${show.title} season ${season.number}`}
                className="group relative"
              >
                <img src={season.posterUrl ?? '/img/placeholder-tall.svg'} alt={`Season ${season.number} poster`} />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="absolute left-2 top-2 font-medium text-white">Season {season.number}</p>
                </div>

                {isAuthenticated ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'absolute bottom-2 right-2',
                      season.userProgress.watched ? 'text-green-500' : 'text-white'
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleWatchSeason(season.id, season.userProgress.watched)
                    }}
                  >
                    <CircleCheck className="!h-6 !w-6" />
                  </Button>
                ) : null}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  )
}
