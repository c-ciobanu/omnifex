import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faFaceFrown, faFaceSmile } from '@fortawesome/free-regular-svg-icons'
import { faBars, faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from '@headlessui/react'
import clsx from 'clsx'

import { Link, routes, useLocation } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/dist/toast'

import { useAuth } from 'src/auth'

const authenticatedNavigation = [
  { name: 'Movies', href: () => routes.moviesDashboard() },
  { name: 'Books', href: () => routes.booksDashboard() },
  { name: 'Documents', href: () => routes.documents() },
]
const guestNavigation = [
  { name: 'Search Movie', href: () => routes.search({ entity: 'movie' }) },
  { name: 'Search Book', href: () => routes.search({ entity: 'book' }) },
]

const authenticatedMenu = []
const guestMenu = [
  { name: 'Sign in', href: () => routes.login() },
  { name: 'Sign up', href: () => routes.signup() },
]

type AppLayoutProps = {
  children: React.ReactNode
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const { logOut, isAuthenticated, currentUser } = useAuth()
  const { pathname } = useLocation()

  const navigationLinks = isAuthenticated ? authenticatedNavigation : guestNavigation
  const menuLinks = isAuthenticated ? authenticatedMenu : guestMenu

  return (
    <>
      <Toaster />

      <Disclosure as="nav" className="bg-gray-800">
        {({ open, close }) => (
          <>
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <Link to={isAuthenticated ? routes.documents() : routes.home()} className="flex-shrink-0">
                  <img className="h-8 w-8" src="/img/logo.svg" alt="Popcorn Time" />
                </Link>

                <div className="ml-10 hidden items-baseline space-x-4 md:flex">
                  {navigationLinks.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href()}
                      className={clsx(
                        pathname === item.href()
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'rounded-md px-3 py-2 text-sm font-medium'
                      )}
                      aria-current={pathname === item.href() ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={routes.search({ entity: 'movie' })}
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <FontAwesomeIcon icon={faMagnifyingGlass} fixedWidth className="text-xl" />
                </Link>

                <div className="hidden md:block">
                  <Menu as="div" className="relative">
                    <div>
                      <MenuButton className="-mr-2 rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                        <FontAwesomeIcon
                          icon={isAuthenticated ? faFaceSmile : faFaceFrown}
                          fixedWidth
                          className="text-xl"
                        />
                      </MenuButton>
                    </div>

                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems
                        anchor="bottom end"
                        className="absolute z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg"
                      >
                        {menuLinks.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href()}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <MenuItem as="span">{item.name}</MenuItem>
                          </Link>
                        ))}

                        {isAuthenticated ? (
                          <MenuItem>
                            <button
                              onClick={logOut}
                              className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100"
                            >
                              Sign out
                            </button>
                          </MenuItem>
                        ) : null}
                      </MenuItems>
                    </Transition>
                  </Menu>
                </div>

                <div className="-mr-2 md:hidden">
                  <DisclosureButton className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                    {open ? (
                      <FontAwesomeIcon icon={faX} fixedWidth className="text-xl" />
                    ) : (
                      <FontAwesomeIcon icon={faBars} fixedWidth className="text-xl" />
                    )}
                  </DisclosureButton>
                </div>
              </div>
            </div>

            <DisclosurePanel className="bg-gray-800 md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigationLinks.map((item) => (
                  <DisclosureButton
                    key={item.name}
                    className={clsx(
                      pathname === item.href()
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                      'w-full rounded-md text-left text-base font-medium'
                    )}
                    aria-current={pathname === item.href() ? 'page' : undefined}
                  >
                    <Link to={item.href()} onClick={() => close()} className="block w-full px-3 py-2">
                      {item.name}
                    </Link>
                  </DisclosureButton>
                ))}
              </div>

              <div className="space-y-2 border-t border-gray-700 py-4">
                {isAuthenticated ? (
                  <div className="flex items-center gap-2 px-5 text-white">
                    <FontAwesomeIcon icon={faFaceSmile} fixedWidth className="text-xl" />

                    <p className="text-base font-medium">{currentUser.username}</p>
                  </div>
                ) : null}

                <div className="space-y-1 px-2">
                  {menuLinks.map((item) => (
                    <DisclosureButton
                      key={item.name}
                      className="w-full rounded-md text-left text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      <Link to={item.href()} onClick={() => close()} className="block w-full px-3 py-2">
                        {item.name}
                      </Link>
                    </DisclosureButton>
                  ))}

                  {isAuthenticated ? (
                    <DisclosureButton
                      onClick={logOut}
                      className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                    >
                      Sign out
                    </DisclosureButton>
                  ) : null}
                </div>
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      <main className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">{children}</main>

      <footer className="mx-auto max-w-7xl space-y-2 border-t border-gray-200 p-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link to="https://www.themoviedb.org" target="_blank">
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="TMDB logo"
              className="w-28"
            />
          </Link>
          <p>Movie data provided by TMDB</p>
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
