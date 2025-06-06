import { CreateWorkoutTemplateMutation, CreateWorkoutTemplateMutationVariables } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { Metadata, useMutation } from '@redwoodjs/web'

import WorkoutForm from 'src/components/WorkoutForm/WorkoutForm'

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

  return (
    <>
      <Metadata title="New Workout Template" robots="noindex" />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">New Workout Template</h2>

        <WorkoutForm
          onSubmit={(data) => createWorkoutTemplate({ variables: { input: data } })}
          submitText="Save Workout Template"
        />
      </div>
    </>
  )
}

export default NewTemplatePage
