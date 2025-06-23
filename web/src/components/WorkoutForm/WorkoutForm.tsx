import { useState } from 'react'

import { Dumbbell, Plus, Trash2 } from 'lucide-react'

import { useFieldArray, useForm } from '@redwoodjs/forms'

import { Form, FormSubmit } from 'src/components/form'
import { FormInput, FormSwitch } from 'src/components/form/elements'
import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardTitle } from 'src/components/ui/card'
import { useExercises } from 'src/hooks/useExercises/useExercises'

import ExerciseFormModal, { ExerciseFormValues } from './ExerciseFormModal'

export type WorkoutFormValues = {
  name: string
  exercises: (ExerciseFormValues & { order: number; done?: boolean })[]
}

const workoutFormDefaultValues = {
  exercises: [],
}

interface Props {
  onSubmit: (value: WorkoutFormValues) => void
  submitText: string
  defaultValues?: Partial<WorkoutFormValues>
  withChecks?: boolean
}

const WorkoutForm = ({ onSubmit, submitText, defaultValues, withChecks }: Props) => {
  const [showNewExerciseModal, setShowNewExerciseModal] = useState(false)
  const exercises = useExercises()
  const formMethods = useForm<WorkoutFormValues>({ defaultValues: defaultValues ?? workoutFormDefaultValues })

  const {
    fields: exercisesFields,
    append: exercisesAppend,
    remove: exercisesRemove,
  } = useFieldArray({ control: formMethods.control, name: 'exercises' })

  const onNewExerciseSubmit = (data: ExerciseFormValues) => {
    exercisesAppend({ ...data, order: exercisesFields.length + 1 })
    setShowNewExerciseModal(false)
  }

  return (
    <>
      <Form<WorkoutFormValues> formMethods={formMethods} onSubmit={onSubmit} className="space-y-6">
        <FormInput name="name" label="Name" validation={{ required: true }} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle>Exercises</CardTitle>

            <Button type="button" variant="outline" onClick={() => setShowNewExerciseModal(true)}>
              <Plus />
              Add Exercise
            </Button>
          </div>

          <Card className="max-w-full">
            <CardContent className="space-y-6">
              {exercisesFields.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <Dumbbell className="h-12 w-12" />

                  <h3 className="text-2xl font-bold tracking-tight">You have no exercises</h3>

                  <p className="text-sm text-muted-foreground">Get started by adding a new exercises.</p>
                </div>
              ) : null}

              {exercisesFields.map((exercise, exerciseIndex) => (
                <div key={exercise.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold">
                      {exercises.find((e) => e.id === exercise.exerciseId)?.name}
                    </h4>

                    <div className="flex items-center justify-between gap-2">
                      {withChecks ? <FormSwitch name={`exercises.${exerciseIndex}.done`} /> : null}

                      <Button
                        type="button"
                        size="icon"
                        variant="destructive"
                        onClick={() => exercisesRemove(exerciseIndex)}
                        disabled={exercisesFields.length <= 1}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {exercise.sets.map((set, index) => (
                      <div
                        key={`${exercise.id}-set-${index}`}
                        className="flex items-center justify-between gap-4 rounded-lg bg-muted p-3 text-sm"
                      >
                        <p className="font-medium">Set {index + 1}</p>
                        <p className="grow text-muted-foreground">
                          {set.weightInKg}kg × {set.reps} reps
                        </p>
                        <p className="text-muted-foreground">{set.restInSeconds}s rest</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <FormSubmit>{submitText}</FormSubmit>
      </Form>

      <ExerciseFormModal
        open={showNewExerciseModal}
        onOpenChange={setShowNewExerciseModal}
        onSubmit={onNewExerciseSubmit}
      />
    </>
  )
}

export default WorkoutForm
