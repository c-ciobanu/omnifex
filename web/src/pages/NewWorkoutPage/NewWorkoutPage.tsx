import { Plus, Trash2 } from 'lucide-react'
import { CreateWorkoutMutation, CreateWorkoutMutationVariables } from 'types/graphql'

import { useFieldArray, useForm } from '@redwoodjs/forms'
import { Metadata, useMutation } from '@redwoodjs/web'

import { Form } from 'src/components/form'
import { FormInput, FormCombobox } from 'src/components/form/elements'
import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardTitle } from 'src/components/ui/card'

const MOCK_EXERCISES = [
  { id: 1, name: 'Bench Press' },
  { id: 2, name: 'Squat' },
  { id: 3, name: 'Deadlift' },
]

const CREATE_WORKOUT = gql`
  mutation CreateWorkoutMutation($input: CreateWorkoutInput!) {
    createWorkout(input: $input) {
      id
    }
  }
`

type FormValues = {
  name: string
  date: string
  startTime: string
  endTime: string
  durationInSeconds: number
  exercises: {
    exerciseId: number
    order: number
    sets: { weightInKg: number; reps: number; restInSeconds: number }[]
  }[]
}

const NewWorkoutPage = () => {
  const [createWorkout] = useMutation<CreateWorkoutMutation, CreateWorkoutMutationVariables>(CREATE_WORKOUT)

  const formMethods = useForm<FormValues>({
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      startTime: new Date().toTimeString().slice(0, 8),
      endTime: new Date(Date.now() + 3600000).toTimeString().slice(0, 8),
      durationInSeconds: 3600,
      exercises: [
        {
          order: 1,
          exerciseId: undefined,
          sets: [{ weightInKg: undefined, reps: undefined, restInSeconds: undefined }],
        },
      ],
    },
  })
  const {
    fields: exercisesFields,
    append: exercisesAppend,
    remove: exercisesRemove,
  } = useFieldArray({ control: formMethods.control, name: 'exercises' })

  const onSubmit = (data: Required<FormValues>) => {
    createWorkout({ variables: { input: data } })
  }

  const addSet = (exerciseIndex: number) => {
    const exercise = formMethods.getValues(`exercises.${exerciseIndex}`)

    formMethods.setValue(`exercises.${exerciseIndex}.sets`, [
      ...exercise.sets,
      { weightInKg: undefined, reps: undefined, restInSeconds: undefined },
    ])
  }

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const exercise = formMethods.getValues(`exercises.${exerciseIndex}`)

    formMethods.setValue(
      `exercises.${exerciseIndex}.sets`,
      exercise.sets.filter((_, index) => index !== setIndex)
    )
  }

  return (
    <>
      <Metadata title="New Workout" robots="noindex" />

      <Form formMethods={formMethods} onSubmit={onSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">New Workout</h2>

        <Card>
          <CardContent className="space-y-6">
            <FormInput name="name" label="Workout Name" validation={{ required: true }} />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <CardTitle>Exercises</CardTitle>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    exercisesAppend({
                      order: exercisesFields.length + 1,
                      exerciseId: undefined,
                      sets: [{ weightInKg: undefined, reps: undefined, restInSeconds: undefined }],
                    })
                  }
                >
                  <Plus />
                  Add Exercise
                </Button>
              </div>

              {exercisesFields.map((exercise, exerciseIndex) => (
                <Card key={exercise.id}>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <FormCombobox
                        name={`exercises.${exerciseIndex}.exerciseId`}
                        options={MOCK_EXERCISES.map((e) => ({ value: e.id, label: e.name }))}
                        validation={{ required: true }}
                      />

                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => exercisesRemove(exerciseIndex)}
                        disabled={exercisesFields.length <= 1}
                      >
                        <Trash2 />
                      </Button>
                    </div>

                    {formMethods.watch(`exercises.${exerciseIndex}.sets`)?.map((_, setIndex) => (
                      <div key={setIndex} className="grid grid-cols-4 gap-4">
                        <FormInput
                          name={`exercises.${exerciseIndex}.sets.${setIndex}.weightInKg`}
                          label="Weight (kg)"
                          type="number"
                          validation={{ required: true, valueAsNumber: true }}
                        />

                        <FormInput
                          name={`exercises.${exerciseIndex}.sets.${setIndex}.reps`}
                          label="Reps"
                          type="number"
                          validation={{ required: true, valueAsNumber: true }}
                        />

                        <FormInput
                          name={`exercises.${exerciseIndex}.sets.${setIndex}.restInSeconds`}
                          label="Rest (seconds)"
                          type="number"
                          validation={{ required: true, valueAsNumber: true }}
                        />

                        <div className="flex items-end">
                          <Button
                            variant="outline"
                            onClick={() => removeSet(exerciseIndex, setIndex)}
                            disabled={formMethods.watch(`exercises.${exerciseIndex}.sets`).length <= 1}
                            className="w-full"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button variant="outline" onClick={() => addSet(exerciseIndex)} className="w-full gap-4">
                      <Plus />
                      Add Set
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={formMethods.formState.isSubmitting}>
          Save Workout
        </Button>
      </Form>
    </>
  )
}

export default NewWorkoutPage
