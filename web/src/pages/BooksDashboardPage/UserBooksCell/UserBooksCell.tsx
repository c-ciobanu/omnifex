import type { UserBooksQuery, UserBooksQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps, TypedDocumentNode } from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<UserBooksQuery, UserBooksQueryVariables> = gql`
  query UserBooksQuery($type: UserBookType!) {
    userBooks(type: $type) {
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

export const Success = ({ userBooks }: CellSuccessProps<UserBooksQuery>) => {
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
      {userBooks.map((book) => (
        <li key={book.id}>
          <Link to={routes.book({ googleId: book.googleId })} title={book.title}>
            <img src={book.coverUrl} alt={`${book.title} cover`} className="h-full w-full" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
