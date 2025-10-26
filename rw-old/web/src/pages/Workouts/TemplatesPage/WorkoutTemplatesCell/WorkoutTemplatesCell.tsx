import { useReducer } from 'react'

import { ClipboardList, MoreVertical, Plus } from 'lucide-react'
import type {
  DeleteWorkoutTemplateMutation,
  DeleteWorkoutTemplateMutationVariables,
  WorkoutTemplatesQuery,
  WorkoutTemplatesQueryVariables,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
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

export const QUERY: TypedDocumentNode<WorkoutTemplatesQuery, WorkoutTemplatesQueryVariables> = gql`
  query WorkoutTemplatesQuery {
    workoutTemplates {
      id
      name
    }
  }
`

const DELETE_WORKOUT_TEMPLATE = gql`
  mutation DeleteWorkoutTemplateMutation($id: Int!) {
    deleteWorkoutTemplate(id: $id) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => (
  <div className="absolute-center-main flex flex-col items-center justify-center gap-2">
    <ClipboardList className="h-12 w-12" />

    <h3 className="text-2xl font-bold tracking-tight">You have no templates</h3>

    <p className="mb-4 text-sm text-muted-foreground">Get started by creating a new template.</p>

    <Button asChild>
      <Link to={routes.newWorkoutTemplate()} title="New Template">
        <Plus /> New Template
      </Link>
    </Button>
  </div>
)

export const Failure = ({ error }: CellFailureProps<WorkoutTemplatesQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

function actionWorkoutTemplateReducer(state, action) {
  switch (action.type) {
    case 'setIsOpen': {
      return {
        workoutTemplateIndex: state.workoutTemplateIndex,
        isOpen: action.nextIsOpen,
      }
    }
    case 'open': {
      return {
        workoutTemplateIndex: action.nextWorkoutTemplateIndex,
        isOpen: true,
      }
    }
  }

  throw Error(`Unknown action: ${action.type}.`)
}

export const Success = ({
  workoutTemplates,
}: CellSuccessProps<WorkoutTemplatesQuery, WorkoutTemplatesQueryVariables>) => {
  const [deleteState, deleteDispatch] = useReducer(actionWorkoutTemplateReducer, {
    isOpen: false,
    workoutTemplateIndex: 0,
  })

  const [deleteWorkoutTemplate, { loading }] = useMutation<
    DeleteWorkoutTemplateMutation,
    DeleteWorkoutTemplateMutationVariables
  >(DELETE_WORKOUT_TEMPLATE, {
    variables: { id: workoutTemplates[deleteState.workoutTemplateIndex]?.id },
    onCompleted: () => {
      deleteDispatch({ type: 'setIsOpen', nextIsOpen: false })
    },
    update(cache, { data: { deleteWorkoutTemplate } }) {
      const data = cache.readQuery({ query: QUERY })

      cache.writeQuery({
        query: QUERY,
        data: { ...data, workoutTemplates: data.workoutTemplates.filter((d) => d.id !== deleteWorkoutTemplate.id) },
      })
    },
  })

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
        {workoutTemplates.map((workout, index) => (
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
                  <DropdownMenuItem onClick={() => deleteDispatch({ type: 'open', nextWorkoutTemplateIndex: index })}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>

      <AlertDialog
        open={deleteState.isOpen}
        onOpenChange={(open) => deleteDispatch({ type: 'setIsOpen', nextIsOpen: open })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Workout Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this workout template? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={() => deleteWorkoutTemplate()} disabled={loading}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
