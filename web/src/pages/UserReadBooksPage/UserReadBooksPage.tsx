import { Metadata } from '@redwoodjs/web'

import ReadBooksCell from 'src/components/ReadBooksCell'

const UserReadBooksPage = () => {
  return (
    <>
      <Metadata title="Books I&#39;ve Read" robots="noindex" />

      <h2 className="mb-4 text-2xl font-bold">Books I&#39;ve Read</h2>

      <ReadBooksCell />
    </>
  )
}

export default UserReadBooksPage
