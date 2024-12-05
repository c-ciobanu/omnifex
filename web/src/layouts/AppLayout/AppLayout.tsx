import { useEffect, useState } from 'react'

import { Frown, Menu, Smile, X } from 'lucide-react'

import { Link, NavLink, routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import { Button, buttonVariants } from 'src/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from 'src/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'
import { Separator } from 'src/components/ui/separator'
import Sentry from 'src/lib/sentry'
import { cn } from 'src/lib/utils'

const authenticatedNavigation = [
  { name: 'Movies', href: () => routes.movies() },
  { name: 'Books', href: () => routes.books() },
  { name: 'Documents', href: () => routes.documents() },
  { name: 'Tracker', href: () => routes.tracker() },
  { name: 'Pomodoro Timer', href: () => routes.pomodoro() },
]
const guestNavigation = [
  { name: 'Search Movies', href: () => routes.searchMovies() },
  { name: 'Search Books', href: () => routes.searchBooks() },
  { name: 'Pomodoro Timer', href: () => routes.pomodoro() },
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
  const [isOpen, setIsOpen] = useState(false)

  const navigationLinks = isAuthenticated ? authenticatedNavigation : guestNavigation
  const menuLinks = isAuthenticated ? authenticatedMenu : guestMenu

  useEffect(() => Sentry.setUser(currentUser), [currentUser])

  return (
    <>
      <Toaster />
      <Collapsible asChild className="bg-slate-800" open={isOpen} onOpenChange={setIsOpen}>
        <nav>
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Link to={isAuthenticated ? routes.documents() : routes.home()} onClick={() => setIsOpen(false)}>
                <img className="h-8 w-8" src="/img/logo.svg" alt="Popcorn Time" />
              </Link>

              <div className="ml-10 hidden items-baseline space-x-4 md:flex">
                {navigationLinks.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href()}
                    className={cn(buttonVariants({ variant: 'ghost' }), 'text-gray-300')}
                    activeClassName={cn(buttonVariants({ variant: 'ghost' }), 'bg-gray-900 text-white')}
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <Button asChild variant="ghost" size="icon" className="-mr-2 hidden text-gray-300 md:inline-flex">
                  <DropdownMenuTrigger>
                    {isAuthenticated ? <Smile className="!h-6 !w-6" /> : <Frown className="!h-6 !w-6" />}
                  </DropdownMenuTrigger>
                </Button>

                <DropdownMenuContent>
                  {menuLinks.map((item) => (
                    <Link key={item.name} to={item.href()}>
                      <DropdownMenuItem>{item.name}</DropdownMenuItem>
                    </Link>
                  ))}

                  {isAuthenticated ? <DropdownMenuItem onClick={logOut}>Sign out</DropdownMenuItem> : null}
                </DropdownMenuContent>
              </DropdownMenu>

              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon" className="-mr-2 text-gray-300 md:hidden">
                  {isOpen ? <X className="!h-6 !w-6" /> : <Menu className="!h-6 !w-6" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent className="bg-slate-800 px-4 md:hidden">
            <div className="space-y-1 py-3">
              {navigationLinks.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href()}
                  className={cn(buttonVariants({ variant: 'ghost' }), 'flex justify-start text-gray-300')}
                  activeClassName={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'flex justify-start bg-gray-900 text-white'
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            <Separator className="bg-slate-600" />

            <div className="space-y-2 py-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-2 px-4 text-white">
                  <Smile />
                  <p className="text-base font-medium">{currentUser.username}</p>
                </div>
              ) : null}

              <div className="space-y-1">
                {menuLinks.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href()}
                    className={cn(buttonVariants({ variant: 'ghost' }), 'flex justify-start text-gray-400')}
                    activeClassName={cn(
                      buttonVariants({ variant: 'ghost' }),
                      'flex justify-start bg-gray-900 text-white'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </NavLink>
                ))}

                {isAuthenticated ? (
                  <Button
                    onClick={() => {
                      setIsOpen(false)
                      logOut()
                    }}
                    variant="ghost"
                    className="block text-left text-gray-400"
                  >
                    Sign out
                  </Button>
                ) : null}
              </div>
            </div>
          </CollapsibleContent>
        </nav>
      </Collapsible>
      <main className="mx-auto max-w-7xl p-4 sm:px-6 lg:px-8">{children}</main>

      <Separator className="mx-auto max-w-7xl" />

      <footer className="mx-auto max-w-7xl space-y-2 p-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">
            <img
              src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
              alt="TMDB logo"
              className="w-28"
            />
          </a>
          <p>Movie data provided by TMDB</p>
        </div>

        <p>
          Icons provided by{' '}
          <a href="https://icons8.com" target="_blank" rel="noreferrer">
            icons8.com
          </a>
        </p>

        <p>
          Sound effects from{' '}
          <a
            href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=30968"
            target="_blank"
            rel="noreferrer"
          >
            Pixabay
          </a>
        </p>

        <div className="flex items-center justify-between">
          <p>© {new Date().getFullYear()} Cristi Ciobanu</p>
          <a href="https://github.com/c-ciobanu/popcorn-time" target="_blank" rel="noreferrer">
            <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>
        </div>
      </footer>
    </>
  )
}

export default AppLayout
