import { MoreVertical, Plus } from 'lucide-react'
import type { WorkoutsQuery, WorkoutsQueryVariables } from 'types/graphql'

import { Link } from '@redwoodjs/router'
import type { CellFailureProps, CellSuccessProps, TypedDocumentNode } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'

export const QUERY: TypedDocumentNode<WorkoutsQuery, WorkoutsQueryVariables> = gql`
  query WorkoutsQuery {
    workouts {
      id
      name
      date
      durationInSeconds
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

const formatSecondsToMinutesAndSeconds = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString()
  const s = (seconds % 60).toString()

  return `${m.padStart(2, '0')}:${s.padStart(2, '0')}m`
}

export const Success = ({ workouts }: CellSuccessProps<WorkoutsQuery>) => {
  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Start New Workout
        </Button>
      </div>

      <ul className="divide-y divide-white">
        {workouts.map((workout) => (
          <li key={workout.id} className="flex items-center justify-between gap-6 py-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{workout.name}</p>
              <p className="text-xs text-muted-foreground">
                <time dateTime={workout.date}>{workout.date}</time>
                {' • '}
                {formatSecondsToMinutesAndSeconds(workout.durationInSeconds)}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <Button asChild variant="outline">
                <Link to={'#'} title={workout.name}>
                  View Workout
                </Link>
              </Button>

              <DropdownMenu>
                <Button asChild variant="ghost" size="icon">
                  <DropdownMenuTrigger>
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                </Button>

                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
