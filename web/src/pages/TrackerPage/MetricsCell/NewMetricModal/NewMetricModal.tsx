import { DateField, FieldError, Form, Label, Submit, TextField } from '@redwoodjs/forms'

import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/dialog'

type NewMetricModalProps = {
  trigger: React.ReactNode
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onSubmit: ({ name, unit, entry }: { name: string; unit?: string; entry: { value: string; date: Date } }) => void
  isSubmitting: boolean
}

const NewMetricModal = (props: NewMetricModalProps) => {
  const { trigger, isOpen, setIsOpen, onSubmit, isSubmitting } = props

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>New Metric</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <fieldset>
              <Label name="name" className="form-label" errorClassName="form-label form-label-error">
                Name
              </Label>
              <TextField
                name="name"
                className="form-input"
                errorClassName="form-input form-input-error"
                validation={{ required: true }}
              />
              <FieldError name="name" className="form-field-error" />
            </fieldset>

            <fieldset>
              <Label name="unit" className="form-label" errorClassName="form-label form-label-error">
                Unit
              </Label>
              <TextField name="unit" className="form-input" errorClassName="form-input form-input-error" />
              <FieldError name="unit" className="form-field-error" />
            </fieldset>

            <fieldset>
              <Label name="entry.value" className="form-label" errorClassName="form-label form-label-error">
                Entry Value
              </Label>
              <TextField
                name="entry.value"
                className="form-input"
                errorClassName="form-input form-input-error"
                validation={{ required: true }}
              />
              <FieldError name="entry.value" className="form-field-error" />
            </fieldset>

            <fieldset>
              <Label name="entry.date" className="form-label" errorClassName="form-label form-label-error">
                Entry Date
              </Label>
              <DateField
                name="entry.date"
                defaultValue={new Date().toISOString().substring(0, 10)}
                className="form-input"
                errorClassName="form-input form-input-error"
                validation={{ required: true }}
              />
              <FieldError name="entry.date" className="form-field-error" />
            </fieldset>
          </div>

          <DialogFooter className="gap-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>

            <Button asChild>
              <Submit disabled={isSubmitting}>Save</Submit>
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewMetricModal
