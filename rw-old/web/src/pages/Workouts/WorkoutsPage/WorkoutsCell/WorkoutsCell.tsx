import { useReducer, useState } from 'react'

import { Dumbbell, MoreVertical, Plus } from 'lucide-react'
import type {
  DeleteWorkoutMutation,
  DeleteWorkoutMutationVariables,
  WorkoutsQuery,
  WorkoutsQueryVariables,
} from 'types/graphql'

import { Link, navigate, routes } from '@redwoodjs/router'
import { useMutation, type CellFailureProps, type CellSuccessProps, type TypedDocumentNode } from '@redwoodjs/web'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'src/components/ui/alert-dialog'
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

import TemplateSelectorModal from './TemplateSelectorModal/TemplateSelectorModal'

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

const DELETE_WORKOUT = gql`
  mutation DeleteWorkoutMutation($id: Int!) {
    deleteWorkout(id: $id) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  const [templateSelectorModalOpen, setTemplateSelectorModalOpen] = useState(false)

  return (
    <>
      <div className="absolute-center-main flex flex-col items-center justify-center gap-2">
        <Dumbbell className="h-12 w-12" />

        <h3 className="text-2xl font-bold tracking-tight">You have no workouts</h3>

        <p className="mb-4 text-sm text-muted-foreground">Get started by starting a new workout.</p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus /> Start New Workout
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="dropdown-menu-content">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => setTemplateSelectorModalOpen(true)}>From template</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(routes.newWorkout())}>Empty</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {templateSelectorModalOpen ? <TemplateSelectorModal onClose={() => setTemplateSelectorModalOpen(false)} /> : null}
    </>
  )
}

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

function actionWorkoutReducer(state, action) {
  switch (action.type) {
    case 'setIsOpen': {
      return {
        workoutIndex: state.workoutIndex,
        isOpen: action.nextIsOpen,
      }
    }
    case 'open': {
      return {
        workoutIndex: action.nextWorkoutIndex,
        isOpen: true,
      }
    }
  }

  throw Error(`Unknown action: ${action.type}.`)
}

export const Success = ({ workouts }: CellSuccessProps<WorkoutsQuery, WorkoutsQueryVariables>) => {
  const [deleteState, deleteDispatch] = useReducer(actionWorkoutReducer, { isOpen: false, workoutIndex: 0 })
  const [templateSelectorModalOpen, setTemplateSelectorModalOpen] = useState(false)

  const [deleteWorkout, { loading }] = useMutation<DeleteWorkoutMutation, DeleteWorkoutMutationVariables>(
    DELETE_WORKOUT,
    {
      variables: { id: workouts[deleteState.workoutIndex]?.id },
      onCompleted: () => {
        deleteDispatch({ type: 'setIsOpen', nextIsOpen: false })
      },
      update(cache, { data: { deleteWorkout } }) {
        const data = cache.readQuery({ query: QUERY })

        cache.writeQuery({
          query: QUERY,
          data: { ...data, workouts: data.workouts.filter((d) => d.id !== deleteWorkout.id) },
        })
      },
    }
  )

  return (
    <>
      <div className="mb-4 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus /> Start New Workout
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="dropdown-menu-content">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => setTemplateSelectorModalOpen(true)}>From template</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(routes.newWorkout())}>Empty</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ul className="divide-y divide-white">
        {workouts.map((workout, index) => (
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
                  <DropdownMenuItem onClick={() => deleteDispatch({ type: 'open', nextWorkoutIndex: index })}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>

      {templateSelectorModalOpen ? <TemplateSelectorModal onClose={() => setTemplateSelectorModalOpen(false)} /> : null}

      <AlertDialog
        open={deleteState.isOpen}
        onOpenChange={(open) => deleteDispatch({ type: 'setIsOpen', nextIsOpen: open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this workout? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={() => deleteWorkout()} disabled={loading}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
