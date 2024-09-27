import { Metadata } from '@redwoodjs/web'

import BookListsCell from './BookListsCell'

const BooksDashboardPage = () => {
  return (
    <>
      <Metadata title="Books Dashboard" robots="noindex" />

      <BookListsCell />
    </>
  )
}

export default BooksDashboardPage
