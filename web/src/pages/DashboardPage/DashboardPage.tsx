import { Metadata } from '@redwoodjs/web'

import UserMoviesCell from 'src/components/UserMoviesCell'

const DashboardPage = () => {
  return (
    <>
      <Metadata title="Dashboard" description="Dashboard page" />

      <UserMoviesCell />
    </>
  )
}

export default DashboardPage
