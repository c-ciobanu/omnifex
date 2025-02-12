import { useMutation } from '@apollo/client'
import { Calendar, Check, CircleCheck, Clock3, EyeOff, Star } from 'lucide-react'
import type { SeasonQuery } from 'types/graphql'

import { type CellFailureProps, type CellSuccessProps, Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { Button } from 'src/components/ui/button'
import { Card, CardContent } from 'src/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'
import { Progress } from 'src/components/ui/progress'

export const QUERY = gql`
  query SeasonQuery($showTmdbId: Int!, $seasonNumber: Int!) {
    season(showTmdbId: $showTmdbId, seasonNumber: $seasonNumber) {
      id
      airDate
      number
      overview
      posterUrl
      rating
      episodes {
        id
        airDate
        number
        overview
        rating
        runtime
        stillUrl
        title
      }
      userProgress {
        watched
        watchedEpisodes
        watchedPercentage
      }
      watchedEpisodes {
        id
        episodeId
      }
    }
    show(tmdbId: $showTmdbId) {
      id
      title
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

const WATCH_EPISODE_MUTATION = gql`
  mutation WatchEpisodeMutation($id: Int!) {
    watchEpisode(id: $id) {
      id
    }
  }
`

const UNWATCH_EPISODE_MUTATION = gql`
  mutation UnwatchEpisodeMutation($id: Int!) {
    unwatchEpisode(id: $id) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({
  season,
  show,
  showTmdbId,
  seasonNumber,
}: CellSuccessProps<SeasonQuery> & { showTmdbId: number; seasonNumber: number }) => {
  const { isAuthenticated } = useAuth()

  const [watchSeason, { loading: watchSeasonLoading }] = useMutation(WATCH_SEASON_MUTATION, {
    variables: { id: season.id },
    refetchQueries: [{ query: QUERY, variables: { showTmdbId, seasonNumber } }],
  })
  const [unwatchSeason] = useMutation(UNWATCH_SEASON_MUTATION, {
    variables: { id: season.id },
    refetchQueries: [{ query: QUERY, variables: { showTmdbId, seasonNumber } }],
  })
  const [watchEpisode] = useMutation(WATCH_EPISODE_MUTATION, {
    refetchQueries: [{ query: QUERY, variables: { showTmdbId, seasonNumber } }],
  })
  const [unwatchEpisode] = useMutation(UNWATCH_EPISODE_MUTATION, {
    refetchQueries: [{ query: QUERY, variables: { showTmdbId, seasonNumber } }],
  })

  function toggleWatchEpisode(episodeId: number) {
    if (isWatchedEpisode(episodeId)) {
      unwatchEpisode({ variables: { id: episodeId } })
    } else {
      watchEpisode({ variables: { id: episodeId } })
    }
  }

  function isWatchedEpisode(episodeId: number) {
    return season.watchedEpisodes.some((e) => e.episodeId === episodeId)
  }

  return (
    <>
      <Metadata title={`${show.title} season ${season.number}`} description={season.overview} />

      <div className="space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex w-full items-start gap-6">
            <img
              src={season.posterUrl ?? '/img/placeholder-tall.svg'}
              alt={`${show.title} season ${season.number} poster`}
              className="w-1/4"
            />

            <div className="space-y-3">
              <h1 className="text-2xl font-bold">{show.title}</h1>
              <h2 className="text-2xl font-semibold">Season {season.number}</h2>

              <p className="flex items-center">
                <Star className="mr-1 h-5 w-5 fill-yellow-300 text-yellow-300" />
                <span className="font-medium text-gray-900">{season.rating}</span>/10
                {' · '}
                <Calendar className="mx-1 h-5 w-5" />
                {season.airDate}
              </p>

              <p className="prose max-w-none">{season.overview}</p>
            </div>
          </div>

          {isAuthenticated ? (
            <div className="lg:w-72 lg:flex-shrink-0">
              {season.watchedEpisodes.length === 0 ? (
                <Button
                  onClick={() => watchSeason()}
                  disabled={watchSeasonLoading}
                  variant="outline"
                  size="lg"
                  className="h-12 w-full justify-start gap-4 border-teal-500 px-2 text-base uppercase text-teal-500 hover:bg-teal-500 hover:text-white"
                >
                  <EyeOff />
                  <span>Watch all the episodes</span>
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div>
                      <Button
                        size="lg"
                        className="h-12 w-full justify-start gap-4 rounded-none bg-teal-500 px-2 text-white hover:bg-teal-500/80"
                      >
                        <Check className="!h-6 !w-6" />

                        <div className="text-left">
                          <p className="text-sm uppercase">{season.userProgress.watchedPercentage}% Watched</p>
                          <p className="text-xs">
                            {season.userProgress.watchedEpisodes}/{season.episodes.length} episodes
                          </p>
                        </div>
                      </Button>

                      <Progress
                        value={season.userProgress.watchedPercentage}
                        className="rounded-none bg-teal-600/40 *:bg-teal-400"
                      />
                    </div>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="dropdown-menu-content">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    {!season.userProgress.watched ? (
                      <DropdownMenuItem onClick={() => watchSeason()}>Watch remaining episodes</DropdownMenuItem>
                    ) : null}
                    <DropdownMenuItem onClick={() => unwatchSeason()} className="text-destructive">
                      Unwatch all episodes
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          ) : null}
        </div>

        <h3 className="text-2xl font-semibold">Episodes</h3>

        {season.episodes.map((episode) => (
          <Card key={episode.id} className="w-full max-w-full">
            <CardContent className="flex flex-col gap-4 md:flex-row">
              <img
                src={episode.stillUrl ?? '/img/placeholder-wide.svg'}
                alt={`${episode.title} still`}
                className="rounded-md md:w-1/4"
              />

              <div className="space-y-2 md:w-3/4">
                <div className="flex justify-between">
                  <h4 className="text-lg font-semibold">
                    {episode.number.toString().padStart(2, '0')}. {episode.title}
                  </h4>

                  {isAuthenticated ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className={isWatchedEpisode(episode.id) ? 'text-green-500' : 'text-black'}
                      onClick={() => toggleWatchEpisode(episode.id)}
                    >
                      <CircleCheck className="!h-6 !w-6" />
                    </Button>
                  ) : null}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {episode.airDate}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock3 className="h-4 w-4" />
                    {episode.runtime} min
                  </span>

                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                    {episode.rating.toFixed(1)}
                  </span>
                </div>

                <p className="prose max-w-none">{episode.overview}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}
