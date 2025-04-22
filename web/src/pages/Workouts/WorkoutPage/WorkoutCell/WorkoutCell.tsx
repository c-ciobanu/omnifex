import { useState } from 'react'

import { Calendar, Clock, Dumbbell, Info, Layers } from 'lucide-react'
import type { WorkoutQuery, WorkoutQueryVariables } from 'types/graphql'

import { type CellFailureProps, type CellSuccessProps, type TypedDocumentNode, Metadata } from '@redwoodjs/web'

import ExerciseModal from 'src/components/ExerciseModal/ExerciseModal'
import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card'
import { formatSecondsToDescriptiveMinutesAndSeconds, formatTime } from 'src/utils/time'

export const QUERY: TypedDocumentNode<WorkoutQuery, WorkoutQueryVariables> = gql`
  query WorkoutQuery($id: Int!) {
    workout(id: $id) {
      id
      name
      date
      startTime
      endTime
      durationInSeconds
      exercises {
        id
        order
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

export const Failure = ({ error }: CellFailureProps<WorkoutQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ workout }: CellSuccessProps<WorkoutQuery, WorkoutQueryVariables>) => {
  const [selectedExercise, setSelectedExercise] = useState<WorkoutQuery['workout']['exercises'][number]['exercise']>()

  const totalExercises = workout.exercises.length
  const totalSets = workout.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0)

  return (
    <>
      <Metadata title={workout.name} robots="noindex" />

      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">{workout.name} Workout Summary</h2>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <p>{workout.date}</p>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <p>Start: {formatTime(workout.startTime)}</p>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <p>End: {formatTime(workout.endTime)}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-xl font-medium">
                {formatSecondsToDescriptiveMinutesAndSeconds(workout.durationInSeconds)}
              </p>
            </CardContent>
          </Card>

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

        <Card>
          <CardHeader>
            <CardTitle>Exercises</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {workout.exercises.map((exercise) => (
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
      </div>

      <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(undefined)} />
    </>
  )
}
