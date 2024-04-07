import { Metadata } from '@redwoodjs/web'

import ToReadBooksCell from 'src/components/ToReadBooksCell'

const UserBooksReadingListPage = () => {
  return (
    <>
      <Metadata title="UserBooksReadingList" description="UserBooksReadingList page" />

      <h2 className="mb-4 text-2xl font-bold">My Books Reading List</h2>

      <ToReadBooksCell />
    </>
  )
}

export default UserBooksReadingListPage
