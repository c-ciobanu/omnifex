import { useState } from 'react'

import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transition } from '@headlessui/react'

import { Form, SubmitHandler, TextField, useForm } from '@redwoodjs/forms'

import batmanLogo from './batman-logo.svg'

type AppLayoutProps = {
  children?: React.ReactNode
}
interface FormValues {
  title: string
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [showSearchInput, setShowSearchInput] = useState(false)
  const formMethods = useForm({ mode: 'onBlur' })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.log(data)
  }

  return (
    <>
      <header className="relative flex h-12 items-center justify-between bg-neutral-800 px-4 text-white">
        <img src={batmanLogo} alt="Logo" title="Batman is here!" />
        <h1 className="text-xl">Favorites Hub</h1>
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="text-xl"
          fixedWidth
          onClick={() => setShowSearchInput(true)}
        />

        <Transition
          className="absolute right-4 top-0 flex h-full items-center bg-neutral-800"
          show={showSearchInput}
          unmount={false}
          enter="transition-width duration-500"
          enterFrom="w-0"
          enterTo="w-header-without-p"
          leave="transition-width duration-500"
          leaveFrom="w-header-without-p"
          leaveTo="w-0"
        >
          <Form onSubmit={onSubmit} formMethods={formMethods} className="grow">
            <TextField
              name="title"
              placeholder="Search for a movie"
              className="w-full bg-transparent text-neutral-400 placeholder-neutral-400 outline-none"
              validation={{ required: true }}
            />
          </Form>

          <FontAwesomeIcon
            icon={faX}
            className="text-xl"
            fixedWidth
            onClick={() => {
              formMethods.reset()
              setShowSearchInput(false)
            }}
          />
        </Transition>
      </header>

      <main className="min-h-main bg-black text-white">{children}</main>
    </>
  )
}

export default AppLayout
