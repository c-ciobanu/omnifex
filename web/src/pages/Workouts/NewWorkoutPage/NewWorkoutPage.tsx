import { useRef } from 'react'

import { differenceInSeconds } from 'date-fns'
import { CreateWorkoutMutation, CreateWorkoutMutationVariables } from 'types/graphql'

import { Submit } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata, useMutation } from '@redwoodjs/web'

import { Form } from 'src/components/form'
import { buttonVariants } from 'src/components/ui/button'
import WorkoutTemplateForm, {
  workoutTemplateFormDefaultValues,
  WorkoutTemplateFormValues,
} from 'src/components/WorkoutTemplateForm/WorkoutTemplateForm'
import { cn } from 'src/lib/utils'

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

  const onSubmit = (data: WorkoutTemplateFormValues) => {
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

      <Form<WorkoutTemplateFormValues>
        config={{ defaultValues: workoutTemplateFormDefaultValues }}
        onSubmit={onSubmit}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold tracking-tight">New Workout</h2>

        <WorkoutTemplateForm />

        <Submit className={cn(buttonVariants(), 'w-full')}>Save Workout</Submit>
      </Form>
    </>
  )
}

export default NewWorkoutPage
