import type { BooksReadingListQuery, BooksReadingListQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellFailureProps, CellSuccessProps, TypedDocumentNode } from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<BooksReadingListQuery, BooksReadingListQueryVariables> = gql`
  query BooksReadingListQuery {
    booksReadingList {
      id
      title
      googleId
      coverUrl
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ booksReadingList }: CellSuccessProps<BooksReadingListQuery>) => {
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
      {booksReadingList.map((userBook) => (
        <li key={userBook.id}>
          <Link to={routes.book({ googleId: userBook.googleId })} title={userBook.title}>
            <img src={userBook.coverUrl} alt={`${userBook.title} cover`} className="h-full w-full" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
