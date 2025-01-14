import { Calendar, Clock3, Star } from 'lucide-react'
import type { SeasonQuery } from 'types/graphql'

import { type CellFailureProps, type CellSuccessProps, Metadata } from '@redwoodjs/web'

import { Card, CardContent } from 'src/components/ui/card'

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
    }
    show(tmdbId: $showTmdbId) {
      title
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ season, show }: CellSuccessProps<SeasonQuery>) => {
  return (
    <>
      <Metadata title={`${show.title} season ${season.number}`} description={season.overview} />

      <div className="space-y-6">
        <div className="flex items-start gap-6">
          <img src={season.posterUrl} alt={`${show.title} season ${season.number} poster`} className="w-1/4" />

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

        <h3 className="text-2xl font-semibold">Episodes</h3>

        {season.episodes.map((episode) => (
          <Card key={episode.id} className="w-full max-w-full">
            <CardContent className="flex flex-col gap-4 md:flex-row">
              <img src={episode.stillUrl} alt={`${episode.title} still`} className="rounded-md md:w-1/4" />

              <div className="space-y-2 md:w-3/4">
                <h4 className="text-lg font-semibold">
                  {episode.number.toString().padStart(2, '0')}. {episode.title}
                </h4>

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
