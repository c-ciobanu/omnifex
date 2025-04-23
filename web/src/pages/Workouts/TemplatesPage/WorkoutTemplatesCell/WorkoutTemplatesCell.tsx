import { MoreVertical, Plus } from 'lucide-react'
import type { WorkoutTemplatesQuery, WorkoutTemplatesQueryVariables } from 'types/graphql'

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

export const QUERY: TypedDocumentNode<WorkoutTemplatesQuery, WorkoutTemplatesQueryVariables> = gql`
  query WorkoutTemplatesQuery {
    workoutTemplates {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps<WorkoutTemplatesQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({
  workoutTemplates,
}: CellSuccessProps<WorkoutTemplatesQuery, WorkoutTemplatesQueryVariables>) => {
  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button asChild>
          <Link to={routes.newWorkoutTemplate()} title="New Template">
            <Plus /> New Template
          </Link>
        </Button>
      </div>

      <ul className="divide-y divide-white">
        {workoutTemplates.map((workout) => (
          <li key={workout.id} className="flex items-center justify-between gap-6 py-4">
            <p className="text-sm font-medium">{workout.name}</p>

            <div className="flex shrink-0 items-center gap-4">
              <Button asChild variant="outline">
                <Link to={routes.workoutTemplate({ id: workout.id })} title={workout.name}>
                  View Template
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
