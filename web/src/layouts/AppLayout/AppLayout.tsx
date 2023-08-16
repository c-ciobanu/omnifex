import { useEffect, useState } from 'react'

import { faMagnifyingGlass, faRightFromBracket, faRightToBracket, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Transition } from '@headlessui/react'

import { Form, SubmitHandler, TextField, useForm } from '@redwoodjs/forms'
import { Link, routes, useLocation } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'
import MoviesCell from 'src/components/MoviesCell'

import batmanLogo from './batman-logo.svg'

type AppLayoutProps = {
  children?: React.ReactNode
}

interface FormValues {
  title: string
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { logOut, isAuthenticated } = useAuth()
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [title, setTitle] = useState<string>()
  const { pathname } = useLocation()
  const formMethods = useForm()

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setTitle(data.title)
  }

  useEffect(() => {
    formMethods.reset()
    setShowSearchInput(false)
    setTitle(undefined)
  }, [pathname])

  return (
    <>
      <Toaster />

      <header className="h-header fixed left-0 top-0 w-full items-center justify-between bg-gray-800 px-4 sm:px-6 lg:px-8">
        <nav className="max-w-container relative mx-auto flex h-full items-center justify-between text-gray-300 ">
          <img src={batmanLogo} alt="Logo" title="Batman is here!" />
          <Link to={routes.home()}>
            <h1 className="text-xl hover:text-white">Batman&#39;s Lair</h1>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button type="button" onClick={logOut} className="icon-bg-dark">
                <FontAwesomeIcon icon={faRightFromBracket} fixedWidth />
              </button>
            ) : (
              <Link to={routes.login()} className="icon-bg-dark">
                <FontAwesomeIcon icon={faRightToBracket} fixedWidth />
              </Link>
            )}

            <button type="button" className="icon-bg-dark">
              <FontAwesomeIcon icon={faMagnifyingGlass} fixedWidth onClick={() => setShowSearchInput(true)} />
            </button>
          </div>

          <Transition
            className="absolute right-0 top-0 flex h-full items-center bg-gray-800"
            show={showSearchInput}
            unmount={false}
            enter="transition-width duration-500"
            enterFrom="w-0"
            enterTo="w-full"
            leave="transition-width duration-500"
            leaveFrom="w-full"
            leaveTo="w-0"
          >
            <Form onSubmit={onSubmit} formMethods={formMethods} className="grow">
              <TextField
                name="title"
                placeholder="Search for a movie"
                className="w-full bg-transparent placeholder-gray-300 outline-none"
                validation={{ required: true }}
              />
            </Form>

            <button type="button" className="icon-bg-dark">
              <FontAwesomeIcon
                icon={faX}
                fixedWidth
                onClick={() => {
                  formMethods.reset()
                  setShowSearchInput(false)
                  setTitle(undefined)
                }}
              />
            </button>
          </Transition>
        </nav>
      </header>

      <main className="min-h-main max-w-container mx-auto mt-16">
        {title ? <MoviesCell title={title} /> : children}
      </main>
    </>
  )
}

export default AppLayout
