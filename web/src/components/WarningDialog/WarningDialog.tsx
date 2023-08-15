import { Fragment, useRef } from 'react'

import { faExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transition, Dialog as DialogPrimitive } from '@headlessui/react'

import { CheckboxField, Form, Label, Submit, SubmitHandler } from '@redwoodjs/forms'

type WarningDialogProps = {
  isOpen: boolean
  onClose: () => void
  onContinue: (checkboxChecked: boolean) => void
  title: string
  description: string
}

interface FormValues {
  dontShowAgain: boolean
}

const WarningDialog = ({ isOpen, onClose, onContinue, title, description }: WarningDialogProps) => {
  const continueButtonRef = useRef(null)

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onContinue(data.dontShowAgain)
    onClose()
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <DialogPrimitive initialFocus={continueButtonRef} onClose={onClose} className="relative z-10">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPrimitive.Panel
                as={Form}
                onSubmit={onSubmit}
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              >
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                      <FontAwesomeIcon icon={faExclamation} aria-hidden className="h-6 w-6 text-yellow-600" />
                    </div>

                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <DialogPrimitive.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        {title}
                      </DialogPrimitive.Title>

                      <div className="my-2">
                        <p className="text-sm text-gray-500">{description}</p>
                      </div>

                      <fieldset className="flex gap-2">
                        <CheckboxField name="dontShowAgain" />
                        <Label name="dontShowAgain" className="text-sm text-gray-500">
                          Don&#39;t show this message again
                        </Label>
                      </fieldset>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <Submit
                    ref={continueButtonRef}
                    className="w-full rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 sm:ml-3 sm:w-auto"
                  >
                    Continue
                  </Submit>
                </div>
              </DialogPrimitive.Panel>
            </Transition.Child>
          </div>
        </div>
      </DialogPrimitive>
    </Transition.Root>
  )
}

export default WarningDialog
