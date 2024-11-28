import { Plus, Trash2 } from 'lucide-react'
import { CreateWorkoutMutation, CreateWorkoutMutationVariables } from 'types/graphql'

import { Form, SubmitHandler, useFieldArray, useForm } from '@redwoodjs/forms'
import { Metadata, useMutation } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card'
import { FormField, FormInput, FormSelect } from 'src/components/ui/form'

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
    order: number
    sets: {
      weightInKg: number
      reps: number
      restInSeconds: number
    }[]
    exerciseId: string
  }[]
}

const NewWorkoutPage = () => {
  const [createWorkout, { loading }] = useMutation<CreateWorkoutMutation, CreateWorkoutMutationVariables>(
    CREATE_WORKOUT
  )
  const formMethods = useForm<FormValues>({ defaultValues: { exercises: [{ sets: [{}] }] } })
  const { fields, append, remove } = useFieldArray({ control: formMethods.control, name: 'exercises' })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    createWorkout({ variables: { input: data } })
  }

  return (
    <>
      <Metadata title="New Workout" robots="noindex" />

      <Form onSubmit={onSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">New Workout</h2>

        <FormField name="name" label="Workout Name">
          <FormInput name="name" validation={{ required: true }} />
        </FormField>

        <Card>
          <CardHeader>
            <CardTitle>Exercises</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {fields.map((exerciseField, exerciseIndex) => (
              <div key={exerciseField.id} className="space-y-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium">Exercise {exerciseIndex + 1}</h3>

                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(exerciseIndex)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <FormField name={`exercises.${exerciseIndex}.exerciseId`}>
                  <FormSelect
                    name={`exercises.${exerciseIndex}.exerciseId`}
                    options={[
                      { value: '1', label: '3/4 Sit-Up' },
                      { value: '2', label: '90/90 Hamstring' },
                    ]}
                  />
                </FormField>

                <div className="space-y-2">
                  <h4 className="text-md font-medium">Sets</h4>

                  {formMethods.watch(`exercises.${exerciseIndex}.sets`).map((_, setIndex) => (
                    <div
                      key={setIndex}
                      className="grid grid-cols-4 items-end justify-between gap-4 rounded-lg bg-muted p-3 text-sm"
                    >
                      <FormField name={`exercises.${exerciseIndex}.sets.${setIndex}.weightInKg`} label="Weight (kg)">
                        <FormInput
                          name={`exercises.${exerciseIndex}.sets.${setIndex}.weightInKg`}
                          type="number"
                          validation={{ required: true }}
                        />
                      </FormField>

                      <FormField name={`exercises.${exerciseIndex}.sets.${setIndex}.reps`} label="Reps">
                        <FormInput
                          name={`exercises.${exerciseIndex}.sets.${setIndex}.reps`}
                          type="number"
                          validation={{ required: true }}
                        />
                      </FormField>

                      <FormField
                        name={`exercises.${exerciseIndex}.sets.${setIndex}.restInSeconds`}
                        label="Rest (seconds)"
                      >
                        <FormInput
                          name={`exercises.${exerciseIndex}.sets.${setIndex}.restInSeconds`}
                          type="number"
                          validation={{ required: true }}
                        />
                      </FormField>

                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          const currentSets = formMethods.getValues(`exercises.${exerciseIndex}.sets`) || []
                          if (currentSets.length > 1) {
                            const newSets = [...currentSets]
                            newSets.splice(setIndex, 1)
                            formMethods.setValue(`exercises.${exerciseIndex}.sets`, newSets)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 gap-2"
                    onClick={() => {
                      const currentSets = formMethods.getValues(`exercises.${exerciseIndex}.sets`) || []
                      formMethods.setValue(`exercises.${exerciseIndex}.sets`, [
                        ...currentSets,
                        { weightInKg: undefined, reps: undefined, restInSeconds: undefined },
                      ])
                    }}
                  >
                    <Plus className="h-4 w-4" /> Add Set
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() =>
                append({
                  order: undefined,
                  sets: [{ weightInKg: undefined, reps: undefined, restInSeconds: undefined }],
                  exerciseId: undefined,
                })
              }
            >
              <Plus className="h-4 w-4" /> Add Exercise
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading}>
          Save
        </Button>
      </Form>
    </>
  )
}

export default NewWorkoutPage
