import { useState } from 'react'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'

import { DateField, FieldError, Form, Label, Submit, TextField } from '@redwoodjs/forms'

type NewMetricEntryModalProps = {
  trigger: (onClick: () => void) => React.ReactNode
  defaultValue: string
  valueUnit: string
}

const NewMetricEntryModal = (props: NewMetricEntryModalProps) => {
  const { trigger, defaultValue, valueUnit } = props
  const [isOpen, setIsOpen] = useState(false)

  const onSubmit = async () => {}

  return (
    <>
      {trigger(() => setIsOpen(true))}

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-10">
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
                  New Entry
                </DialogTitle>

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

              <div className="flex flex-col gap-4 bg-gray-50 p-4 sm:flex-row-reverse sm:px-6">
                <Submit className="w-full rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:w-auto">
                  Add
                </Submit>

                <button
                  data-autofocus
                  onClick={() => setIsOpen(false)}
                  className="w-full rounded-md bg-white px-4 py-2 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default NewMetricEntryModal
