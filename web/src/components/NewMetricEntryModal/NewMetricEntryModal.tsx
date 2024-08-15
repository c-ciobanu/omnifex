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

type NewMetricEntryModalProps = {
  trigger: React.ReactNode
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onSubmit: ({ value, date }: { value: string; date: Date }) => void
  isSubmitting: boolean
  defaultValue: string
  valueUnit: string
}

const NewMetricEntryModal = (props: NewMetricEntryModalProps) => {
  const { trigger, isOpen, setIsOpen, onSubmit, isSubmitting, defaultValue, valueUnit } = props

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>New Entry</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <fieldset>
              <Label name="value" className="form-label" errorClassName="form-label form-label-error">
                Value [ {valueUnit} ]
              </Label>
              <TextField
                name="value"
                defaultValue={defaultValue}
                className="form-input"
                errorClassName="form-input form-input-error"
                validation={{ required: true }}
              />
              <FieldError name="value" className="form-field-error" />
            </fieldset>

            <fieldset>
              <Label name="date" className="form-label" errorClassName="form-label form-label-error">
                Date
              </Label>
              <DateField
                name="date"
                defaultValue={new Date().toISOString().substring(0, 10)}
                className="form-input"
                errorClassName="form-input form-input-error"
                validation={{ required: true }}
              />
              <FieldError name="date" className="form-field-error" />
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

export default NewMetricEntryModal
