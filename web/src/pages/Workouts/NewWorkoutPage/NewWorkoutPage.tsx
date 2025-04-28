import { useRef } from 'react'

import { differenceInSeconds } from 'date-fns'
import { CreateWorkoutMutation, CreateWorkoutMutationVariables } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { Metadata, useMutation } from '@redwoodjs/web'

import { Form, FormSubmit } from 'src/components/form'
import WorkoutForm, { workoutFormDefaultValues, WorkoutFormValues } from 'src/components/WorkoutForm/WorkoutForm'

const CREATE_WORKOUT = gql`
  mutation CreateWorkoutMutation($input: CreateWorkoutInput!) {
    createWorkout(input: $input) {
      id
    }
  }
`

const NewWorkoutPage = () => {
  const startDate = useRef(new Date())

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

      <Form<WorkoutFormValues>
        config={{ defaultValues: workoutFormDefaultValues }}
        onSubmit={onSubmit}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold tracking-tight">New Workout</h2>

        <WorkoutForm />

        <FormSubmit>Save Workout</FormSubmit>
      </Form>
    </>
  )
}

export default NewWorkoutPage
