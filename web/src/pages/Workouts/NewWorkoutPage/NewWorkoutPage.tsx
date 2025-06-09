import { useRef, useState } from 'react'

import { differenceInSeconds } from 'date-fns'
import { CreateWorkoutMutation, CreateWorkoutMutationVariables, WorkoutTemplateQuery } from 'types/graphql'

import { navigate, routes, useParams } from '@redwoodjs/router'
import { Metadata, useMutation, useQuery } from '@redwoodjs/web'

import WorkoutForm, { WorkoutFormValues } from 'src/components/WorkoutForm/WorkoutForm'
import { useInterval } from 'src/hooks/useInterval/useInterval'
import { formatSecondsToDescriptiveMinutesAndSeconds } from 'src/utils/time'

import { QUERY } from '../TemplatePage/WorkoutTemplateCell'

const CREATE_WORKOUT = gql`
  mutation CreateWorkoutMutation($input: CreateWorkoutInput!) {
    createWorkout(input: $input) {
      id
    }
  }
`

interface WorkoutDurationProps {
  startDate: Date
}

function WorkoutDuration(props: WorkoutDurationProps) {
  const { startDate } = props
  const [secondsPassed, setSecondsPassed] = useState(differenceInSeconds(new Date(), startDate))

  useInterval(() => setSecondsPassed(differenceInSeconds(new Date(), startDate)), 1000)

  return (
    <div className="sticky top-0 flex justify-center">
      <p className="border border-input bg-background px-4 py-2 shadow-sm">
        {formatSecondsToDescriptiveMinutesAndSeconds(secondsPassed)}
      </p>
    </div>
  )
}

const NewWorkoutPage = () => {
  const { copy } = useParams()
  const startDate = useRef(new Date())

  const { data, loading } = useQuery<WorkoutTemplateQuery>(QUERY, { variables: { id: Number(copy) }, skip: !copy })

  const workoutTemplate = !copy || loading ? undefined : data.workoutTemplate

  const [createWorkout] = useMutation<CreateWorkoutMutation, CreateWorkoutMutationVariables>(CREATE_WORKOUT, {
    onCompleted: () => navigate(routes.workouts()),
  })

  const onSubmit = (data: WorkoutFormValues) => {
    const endDate = new Date()

    createWorkout({
      variables: {
        input: {
          ...data,
          date: startDate.current.toISOString().slice(0, 10),
          startTime: `${startDate.current.toTimeString().slice(0, 8)}Z`,
          endTime: `${endDate.toTimeString().slice(0, 8)}Z`,
          durationInSeconds: differenceInSeconds(endDate, startDate.current),
        },
      },
    })
  }

  return (
    <>
      <Metadata title="New Workout" robots="noindex" />

      <WorkoutDuration startDate={startDate.current} />

      {loading ? null : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">New Workout</h2>

          <WorkoutForm
            onSubmit={onSubmit}
            submitText="End Workout"
            defaultValues={
              workoutTemplate
                ? {
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
                  }
                : undefined
            }
          />
        </div>
      )}
    </>
  )
}

export default NewWorkoutPage
