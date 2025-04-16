import { Plus, Trash2 } from 'lucide-react'

import { useFieldArray, useFormContext } from '@redwoodjs/forms'

import { FormCombobox, FormInput } from 'src/components/form/elements'
import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardTitle } from 'src/components/ui/card'

const MOCK_EXERCISES = [
  { id: 1, name: 'Bench Press' },
  { id: 2, name: 'Squat' },
  { id: 3, name: 'Deadlift' },
]

export type WorkoutTemplateFormValues = {
  name: string
  exercises: {
    exerciseId: number
    order: number
    sets: { weightInKg: number; reps: number; restInSeconds: number }[]
  }[]
}

export const workoutTemplateFormDefaultValues = {
  exercises: [
    {
      order: 1,
      exerciseId: undefined,
      sets: [{ weightInKg: undefined, reps: undefined, restInSeconds: undefined }],
    },
  ],
}

const WorkoutTemplateForm = () => {
  const formMethods = useFormContext<WorkoutTemplateFormValues>()

  const {
    fields: exercisesFields,
    append: exercisesAppend,
    remove: exercisesRemove,
  } = useFieldArray({ control: formMethods.control, name: 'exercises' })

  const addSet = (exerciseIndex: number) => {
    const exercise = formMethods.getValues(`exercises.${exerciseIndex}`)

    formMethods.setValue(`exercises.${exerciseIndex}.sets`, [
      ...exercise.sets,
      workoutTemplateFormDefaultValues.exercises[0].sets[0],
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
      <Card className="max-w-full">
        <CardContent className="space-y-6">
          <FormInput name="name" label="Workout Template Name" validation={{ required: true }} />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle>Exercises</CardTitle>

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  exercisesAppend({
                    ...workoutTemplateFormDefaultValues.exercises[0],
                    order: exercisesFields.length + 1,
                  })
                }
              >
                <Plus />
                Add Exercise
              </Button>
            </div>

            {exercisesFields.map((exercise, exerciseIndex) => (
              <Card key={exercise.id} className="max-w-full">
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
    </>
  )
}

export default WorkoutTemplateForm
