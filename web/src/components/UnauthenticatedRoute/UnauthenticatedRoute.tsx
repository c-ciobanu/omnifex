import { Redirect, routes } from '@redwoodjs/router'

import { useAuth } from 'src/auth'

type UnauthenticatedRouteProps = {
  children: React.ReactNode
}

const UnauthenticatedRoute = ({ children }: UnauthenticatedRouteProps) => {
  const { loading, isAuthenticated } = useAuth()

  if (loading) {
    return null
  }

  if (isAuthenticated) {
    return <Redirect to={routes.documents()} options={{ replace: true }} />
  }

  return children as React.JSX.Element
}

export default UnauthenticatedRoute
