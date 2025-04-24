import { useState } from 'react'

import { Dumbbell, Info, Layers, Pencil, X } from 'lucide-react'
import type { WorkoutTemplateQuery, WorkoutTemplateQueryVariables } from 'types/graphql'
import { UpdateWorkoutTemplateMutation, UpdateWorkoutTemplateMutationVariables } from 'types/graphql'

import { Form, Submit } from '@redwoodjs/forms'
import {
  type CellFailureProps,
  type CellSuccessProps,
  type TypedDocumentNode,
  Metadata,
  useMutation,
} from '@redwoodjs/web'

import ExerciseModal from 'src/components/ExerciseModal/ExerciseModal'
import { Button, buttonVariants } from 'src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card'
import WorkoutTemplateForm, { WorkoutTemplateFormValues } from 'src/components/WorkoutTemplateForm/WorkoutTemplateForm'
import { cn } from 'src/lib/utils'

const UPDATE_WORKOUT_TEMPLATE = gql`
  mutation UpdateWorkoutTemplateMutation($id: Int!, $input: WorkoutTemplateInput!) {
    updateWorkoutTemplate(id: $id, input: $input) {
      id
      name
      exercises {
        id
        exercise {
          id
          name
          instructions
          gifUrl
        }
        sets {
          id
          weightInKg
          reps
          restInSeconds
        }
      }
    }
  }
`

export const QUERY: TypedDocumentNode<WorkoutTemplateQuery, WorkoutTemplateQueryVariables> = gql`
  query WorkoutTemplateQuery($id: Int!) {
    workoutTemplate(id: $id) {
      id
      name
      exercises {
        id
        exercise {
          id
          name
          instructions
          gifUrl
        }
        sets {
          id
          weightInKg
          reps
          restInSeconds
        }
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps<WorkoutTemplateQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ workoutTemplate }: CellSuccessProps<WorkoutTemplateQuery, WorkoutTemplateQueryVariables>) => {
  const [editMode, setEditMode] = useState(false)
  const [selectedExercise, setSelectedExercise] =
    useState<WorkoutTemplateQuery['workoutTemplate']['exercises'][number]['exercise']>()

  const totalExercises = workoutTemplate.exercises.length
  const totalSets = workoutTemplate.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0)

  const [updateWorkoutTemplate] = useMutation<UpdateWorkoutTemplateMutation, UpdateWorkoutTemplateMutationVariables>(
    UPDATE_WORKOUT_TEMPLATE,
    {
      onCompleted: () => setEditMode(false),
    }
  )

  const onSubmit = (data: WorkoutTemplateFormValues) => {
    updateWorkoutTemplate({ variables: { id: workoutTemplate.id, input: data } })
  }

  return (
    <>
      <Metadata title={workoutTemplate.name} robots="noindex" />

      <div className="space-y-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold tracking-tight md:text-2xl">
            {workoutTemplate.name} Workout Template Summary
          </h2>

          {editMode ? (
            <Button variant="destructive" onClick={() => setEditMode(false)}>
              <X />
              Cancel
            </Button>
          ) : (
            <Button onClick={() => setEditMode(true)}>
              <Pencil />
              Edit
            </Button>
          )}
        </div>

        {editMode ? (
          <Form<WorkoutTemplateFormValues>
            config={{
              defaultValues: {
                name: workoutTemplate.name,
                exercises: workoutTemplate.exercises.map((exercise, index) => ({
                  exerciseId: exercise.exercise.id,
                  order: index + 1,
                  sets: exercise.sets.map((set) => ({
                    weightInKg: set.weightInKg,
                    reps: set.reps,
                    restInSeconds: set.restInSeconds,
                  })),
                })),
              },
            }}
            onSubmit={onSubmit}
            className="space-y-6"
          >
            <WorkoutTemplateForm />

            <Submit className={cn(buttonVariants(), 'w-full')}>Save Workout Template Changes</Submit>
          </Form>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Exercises</CardTitle>
                  <Dumbbell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>

                <CardContent>
                  <p className="text-xl font-medium">{totalExercises}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Sets</CardTitle>
                  <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>

                <CardContent>
                  <p className="text-xl font-medium">{totalSets}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="max-w-full">
              <CardHeader>
                <CardTitle>Exercises</CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                {workoutTemplate.exercises.map((exercise) => (
                  <div key={exercise.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold">{exercise.exercise.name}</h4>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => setSelectedExercise(exercise.exercise)}
                      >
                        <Info className="h-4 w-4" />
                        How to
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {exercise.sets.map((set, index) => (
                        <div
                          key={set.id}
                          className="flex items-center justify-between gap-4 rounded-lg bg-muted p-3 text-sm"
                        >
                          <p className="font-medium">Set {index + 1}</p>
                          <p className="grow text-muted-foreground">
                            {set.weightInKg}kg × {set.reps} reps
                          </p>
                          <p className="text-muted-foreground">{set.restInSeconds}s rest</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(undefined)} />
    </>
  )
}
