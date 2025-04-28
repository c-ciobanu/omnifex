import { CreateWorkoutTemplateMutation, CreateWorkoutTemplateMutationVariables } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { Metadata, useMutation } from '@redwoodjs/web'

import { Form, FormSubmit } from 'src/components/form'
import WorkoutForm, { workoutFormDefaultValues, WorkoutFormValues } from 'src/components/WorkoutForm/WorkoutForm'

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

        <FormSubmit>Save Workout Template</FormSubmit>
      </Form>
    </>
  )
}

export default NewTemplatePage
