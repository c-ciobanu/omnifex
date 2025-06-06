import { DialogClose } from '@radix-ui/react-dialog'
import { Plus, Trash2 } from 'lucide-react'

import { useFieldArray, useForm } from '@redwoodjs/forms'

import { Form, FormSubmit } from 'src/components/form'
import { FormCombobox, FormInput } from 'src/components/form/elements'
import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardTitle } from 'src/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'src/components/ui/dialog'
import { useExercises } from 'src/hooks/useExercises/useExercises'

export interface ExerciseFormValues {
  exerciseId: number
  sets: { weightInKg: number; reps: number; restInSeconds: number }[]
}

const exerciseFormDefaultValues = {
  exerciseId: undefined,
  sets: [{ weightInKg: undefined, reps: undefined, restInSeconds: undefined }],
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (value: ExerciseFormValues) => void
}

const ExerciseFormModal = (props: Props) => {
  const { open, onOpenChange, onSubmit } = props
  const formMethods = useForm<ExerciseFormValues>({ defaultValues: exerciseFormDefaultValues })
  const exercises = useExercises()

  const {
    fields: setsFields,
    append: setsAppend,
    remove: setsRemove,
  } = useFieldArray({ control: formMethods.control, name: 'sets' })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Exercise</DialogTitle>
        </DialogHeader>

        <Form<ExerciseFormValues>
          formMethods={formMethods}
          onSubmit={(data) => {
            onSubmit(data)
            formMethods.reset()
          }}
          className="space-y-4"
          id="2"
        >
          <FormCombobox
            name="exerciseId"
            options={exercises.map((e) => ({ value: e.id, label: e.name }))}
            validation={{ required: true }}
          />

          {setsFields.map((_, setIndex) => (
            <Card key={setIndex} className="max-w-full">
              <CardTitle className="flex items-center justify-between">
                <p>Set {setIndex + 1}</p>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setsRemove(setIndex)}
                  disabled={setsFields.length <= 1}
                >
                  <Trash2 />
                </Button>
              </CardTitle>

              <CardContent className="space-y-2">
                <FormInput
                  name={`sets.${setIndex}.weightInKg`}
                  label="Weight (kg)"
                  type="number"
                  validation={{ required: true, valueAsNumber: true }}
                />

                <FormInput
                  name={`sets.${setIndex}.reps`}
                  label="Reps"
                  type="number"
                  validation={{ required: true, valueAsNumber: true }}
                />

                <FormInput
                  name={`sets.${setIndex}.restInSeconds`}
                  label="Rest (seconds)"
                  type="number"
                  validation={{ required: true, valueAsNumber: true }}
                />
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={() => setsAppend(exerciseFormDefaultValues.sets[0])}
            className="w-full gap-4"
          >
            <Plus />
            Add Set
          </Button>

          <DialogFooter>
            <DialogClose>Close</DialogClose>

            <FormSubmit className="w-auto" form="2">
              Save
            </FormSubmit>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ExerciseFormModal
