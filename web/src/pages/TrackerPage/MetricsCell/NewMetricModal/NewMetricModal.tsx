import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

import { DateField, FieldError, Form, Label, Submit, TextField } from '@redwoodjs/forms'

type NewMetricModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: ({ name, unit, entry }: { name: string; unit?: string; entry: { value: string; date: Date } }) => void
  isSubmitting: boolean
}

const NewMetricModal = (props: NewMetricModalProps) => {
  const { isOpen, onClose, onSubmit, isSubmitting } = props

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            as={Form}
            onSubmit={onSubmit}
            transition
            className="relative w-full transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="space-y-6 bg-white p-4 sm:p-6">
              <DialogTitle as="h4" className="text-center text-base font-semibold sm:text-left">
                New Metric
              </DialogTitle>

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

            <div className="flex flex-col gap-4 bg-gray-50 p-4 sm:flex-row-reverse sm:px-6">
              <Submit
                disabled={isSubmitting}
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto"
              >
                Save
              </Submit>

              <button
                type="button"
                data-autofocus
                onClick={onClose}
                className="w-full rounded-md bg-white px-4 py-2 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

export default NewMetricModal
