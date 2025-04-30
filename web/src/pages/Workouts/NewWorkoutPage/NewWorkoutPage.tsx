import { useRef } from 'react'

import { differenceInSeconds } from 'date-fns'
import { CreateWorkoutMutation, CreateWorkoutMutationVariables, WorkoutTemplateQuery } from 'types/graphql'

import { navigate, routes, useParams } from '@redwoodjs/router'
import { Metadata, useMutation, useQuery } from '@redwoodjs/web'

import { Form, FormSubmit } from 'src/components/form'
import WorkoutForm, { workoutFormDefaultValues, WorkoutFormValues } from 'src/components/WorkoutForm/WorkoutForm'

import { QUERY } from '../TemplatePage/WorkoutTemplateCell'

const CREATE_WORKOUT = gql`
  mutation CreateWorkoutMutation($input: CreateWorkoutInput!) {
    createWorkout(input: $input) {
      id
    }
  }
`

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

  console.log({ loading })

  return (
    <>
      <Metadata title="New Workout" robots="noindex" />

      {loading ? null : (
        <Form<WorkoutFormValues>
          config={{
            defaultValues: workoutTemplate
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
              : workoutFormDefaultValues,
          }}
          onSubmit={onSubmit}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold tracking-tight">New Workout</h2>

          <WorkoutForm />

          <FormSubmit>Save Workout</FormSubmit>
        </Form>
      )}
    </>
  )
}

export default NewWorkoutPage
