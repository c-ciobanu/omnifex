import { useState } from 'react'

import { Calendar, Clock, Dumbbell, Info, Layers } from 'lucide-react'
import type { WorkoutQuery, WorkoutQueryVariables } from 'types/graphql'

import { type CellFailureProps, type CellSuccessProps, type TypedDocumentNode, Metadata } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card'
import { formatSecondsToDescriptiveMinutesAndSeconds, formatTime } from 'src/utils/time'

import ExerciseModal from './ExerciseModal'

export const QUERY: TypedDocumentNode<WorkoutQuery, WorkoutQueryVariables> = gql`
  query WorkoutQuery($id: Int!) {
    workout(id: $id) {
      id
      name
      date
      startTime
      endTime
      durationInSeconds
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps<WorkoutQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

interface Exercise {
  name: string
  sets: {
    weight: number
    reps: number
    restAfter: number
  }[]
  description: string
  gifUrl: string
}

interface WorkoutSession {
  date: Date
  startTime: Date
  endTime: Date
  duration: number
  exercises: Exercise[]
}

const workoutData: WorkoutSession = {
  date: new Date(),
  startTime: new Date(2023, 5, 10, 14, 30),
  endTime: new Date(2023, 5, 10, 15, 45),
  duration: 4500,
  exercises: [
    {
      name: 'Bench Press',
      sets: [
        { weight: 60, reps: 12, restAfter: 90 },
        { weight: 70, reps: 10, restAfter: 90 },
        { weight: 80, reps: 8, restAfter: 120 },
      ],
      description: 'Lie on a flat bench, lower the bar to your chest, then push it back up.',
      gifUrl: 'https://placehold.co/600x400/EEE/31343C',
    },
    {
      name: 'Squats',
      sets: [
        { weight: 85, reps: 10, restAfter: 120 },
        { weight: 95, reps: 8, restAfter: 120 },
        { weight: 100, reps: 6, restAfter: 180 },
      ],
      description:
        'Stand with feet shoulder-width apart, lower your body as if sitting back into a chair, then return to standing.',
      gifUrl: 'https://placehold.co/600x400/EEE/31343C',
    },
  ],
}

export const Success = ({ workout }: CellSuccessProps<WorkoutQuery, WorkoutQueryVariables>) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise>()
  const totalExercises = workoutData.exercises.length
  const totalSets = workoutData.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0)

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
            {workoutData.exercises.map((exercise, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold">{exercise.name}</h4>

                  <Button variant="ghost" size="sm" className="gap-2" onClick={() => setSelectedExercise(exercise)}>
                    <Info className="h-4 w-4" />
                    How to
                  </Button>
                </div>

                <div className="space-y-3">
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className="flex items-center justify-between gap-4 rounded-lg bg-muted p-3 text-sm"
                    >
                      <p className="font-medium">Set {setIndex + 1}</p>
                      <p className="grow text-muted-foreground">
                        {set.weight}kg × {set.reps} reps
                      </p>
                      <p className="text-muted-foreground">{set.restAfter}s rest</p>
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
