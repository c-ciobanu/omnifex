import { CreateWorkoutTemplateMutation, CreateWorkoutTemplateMutationVariables } from 'types/graphql'

import { Submit } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata, useMutation } from '@redwoodjs/web'

import { Form } from 'src/components/form'
import { buttonVariants } from 'src/components/ui/button'
import WorkoutForm, { workoutFormDefaultValues, WorkoutFormValues } from 'src/components/WorkoutForm/WorkoutForm'
import { cn } from 'src/lib/utils'

const CREATE_WORKOUT_TEMPLATE = gql`
  mutation CreateWorkoutTemplateMutation($input: WorkoutTemplateInput!) {
    createWorkoutTemplate(input: $input) {
      id
    }
  }
`

const NewTemplatePage = () => {
  const [createWorkoutTemplate] = useMutation<CreateWorkoutTemplateMutation, CreateWorkoutTemplateMutationVariables>(
    CREATE_WORKOUT_TEMPLATE,
    {
      onCompleted: () => navigate(routes.workoutTemplates()),
    }
  )

  const onSubmit = (data: WorkoutFormValues) => {
    createWorkoutTemplate({ variables: { input: data } })
  }

  return (
    <>
      <Metadata title="New Workout Template" robots="noindex" />

      <Form<WorkoutFormValues>
        config={{ defaultValues: workoutFormDefaultValues }}
        onSubmit={onSubmit}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold tracking-tight">New Workout Template</h2>

        <WorkoutForm />

        <Submit className={cn(buttonVariants(), 'w-full')}>Save Workout Template</Submit>
      </Form>
    </>
  )
}

export default NewTemplatePage
