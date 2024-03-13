import { Metadata } from '@redwoodjs/web'

import UserMoviesCell from 'src/components/UserMoviesCell'

const DashboardPage = () => {
  return (
    <>
      <Metadata title="Dashboard" description="Dashboard page" />

      <div className="mt-4">
        <UserMoviesCell />
      </div>
    </>
  )
}

export default DashboardPage
