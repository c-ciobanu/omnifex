import { MoreVertical, Plus } from 'lucide-react'
import type { WorkoutsQuery, WorkoutsQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
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
import { formatSecondsToDescriptiveMinutesAndSeconds } from 'src/utils/time'

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

export const Success = ({ workouts }: CellSuccessProps<WorkoutsQuery>) => {
  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button asChild>
          <Link to={routes.newWorkout()} title="Start New Workout">
            <Plus /> Start New Workout
          </Link>
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
                {formatSecondsToDescriptiveMinutesAndSeconds(workout.durationInSeconds)}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <Button asChild variant="outline">
                <Link to={routes.workout({ id: workout.id })} title={workout.name}>
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
