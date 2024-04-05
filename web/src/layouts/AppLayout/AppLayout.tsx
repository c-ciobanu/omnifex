import { Fragment, useEffect, useState } from 'react'

import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faMagnifyingGlass, faRightFromBracket, faRightToBracket, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Listbox, Transition } from '@headlessui/react'
import clsx from 'clsx'

import { Form, SubmitHandler, TextField, useForm } from '@redwoodjs/forms'
import { Link, routes, useLocation } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'
import BooksCell from 'src/components/BooksCell'
import MoviesCell from 'src/components/MoviesCell'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'src/components/Tooltip'

import batmanLogo from './batman-logo.svg'
import bookLogo from './book-logo.svg'

const entities = {
  movie: {
    title: "Batman's Lair",
    img: batmanLogo,
    component: MoviesCell,
  },
  book: {
    title: 'The Paper Palace',
    img: bookLogo,
    component: BooksCell,
  },
}

interface FormValues {
  title: string
}

type AppLayoutProps = {
  children: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { logOut, isAuthenticated } = useAuth()
  const [showSearchInput, setShowSearchInput] = useState(false)
  const [title, setTitle] = useState<string>()
  const [searchEntity, setSearchEntity] = useState<'book' | 'movie'>('movie')
  const { pathname } = useLocation()
  const formMethods = useForm()

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setTitle(data.title)
  }

  useEffect(() => {
    setShowSearchInput(false)
    setTitle(undefined)
  }, [pathname])

  return (
    <>
      <Toaster />

      <header className="bg-gray-800">
        <div className="mx-auto h-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <nav className="relative flex h-full w-full items-center justify-between text-gray-300">
            <Listbox value={searchEntity} onChange={setSearchEntity}>
              <div className="relative flex">
                <Listbox.Button>
                  <img src={entities[searchEntity].img} alt="Logo" />
                </Listbox.Button>

                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute left-full ml-1 w-60 rounded-md border bg-white py-1.5 text-sm text-black shadow-md focus:outline-none">
                    <Listbox.Option
                      value={'movie'}
                      disabled={searchEntity === 'movie'}
                      className={({ active }) =>
                        clsx('flex cursor-default items-center gap-2 px-4 py-2 text-gray-900', active && 'bg-amber-100')
                      }
                    >
                      <img src={batmanLogo} alt="Movies logo" />
                      <span>Search movies</span>
                    </Listbox.Option>

                    <Listbox.Option
                      value={'book'}
                      disabled={searchEntity === 'book'}
                      className={({ active }) =>
                        clsx('flex cursor-default items-center gap-2 px-4 py-2 text-gray-900', active && 'bg-amber-100')
                      }
                    >
                      <img src={bookLogo} alt="Books logo" />
                      <span>Search books</span>
                    </Listbox.Option>
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>

            <Link to={isAuthenticated ? routes.dashboard() : routes.home()}>
              <h1 className="text-xl hover:text-white">{entities[searchEntity].title}</h1>
            </Link>

            <div className="flex items-center gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {isAuthenticated ? (
                      <button type="button" onClick={logOut} className="icon-bg-dark">
                        <FontAwesomeIcon icon={faRightFromBracket} fixedWidth />
                      </button>
                    ) : (
                      <Link to={routes.login()} className="icon-bg-dark">
                        <FontAwesomeIcon icon={faRightToBracket} fixedWidth />
                      </Link>
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>{isAuthenticated ? 'Sign Out' : 'Sign In'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <button type="button" className="icon-bg-dark">
                <FontAwesomeIcon icon={faMagnifyingGlass} fixedWidth onClick={() => setShowSearchInput(true)} />
              </button>
            </div>

            <Transition
              className="absolute right-0 top-0 flex h-full items-center overflow-hidden bg-gray-800"
              show={showSearchInput}
              unmount={false}
              enter="transition-width ease-out duration-500"
              enterFrom="w-0"
              enterTo="w-full"
              leave="transition-width ease-in duration-500"
              leaveFrom="w-full"
              leaveTo="w-0"
            >
              <Form onSubmit={onSubmit} formMethods={formMethods} className="grow">
                <TextField
                  name="title"
                  placeholder={`Search for a ${searchEntity}`}
                  className="w-full bg-transparent placeholder-gray-300 outline-none"
                  validation={{ required: true }}
                />
              </Form>

              <button type="button" className="icon-bg-dark">
                <FontAwesomeIcon
                  icon={faX}
                  fixedWidth
                  onClick={() => {
                    setShowSearchInput(false)
                    setTitle(undefined)
                  }}
                />
              </button>
            </Transition>
          </nav>
        </div>
      </header>

      <main>{title ? entities[searchEntity].component({ title }) : children}</main>

      <footer className="space-y-2">
        <div className="flex items-center gap-2">
          <Link to="https://www.themoviedb.org" target="_blank">
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="TMDB logo"
              className="w-28"
            />
          </Link>
          <p>Data provided by TMDB</p>
        </div>

        <p>
          Icons provided by{' '}
          <Link to="https://icons8.com" target="_blank">
            icons8.com
          </Link>
        </p>

        <div className="flex items-center justify-between">
          <p>© {new Date().getFullYear()} Cristi Ciobanu</p>
          <Link to="https://github.com/c-ciobanu/popcorn-time" className="text-xl">
            <FontAwesomeIcon icon={faGithub} fixedWidth />
          </Link>
        </div>
      </footer>
    </>
  )
}

export default AppLayout
