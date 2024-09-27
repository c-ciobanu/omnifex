import type { BookListItemsQuery, BookListItemsQueryVariables } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps, TypedDocumentNode } from '@redwoodjs/web'

export const QUERY: TypedDocumentNode<BookListItemsQuery, BookListItemsQueryVariables> = gql`
  query BookListItemsQuery($listId: Int!) {
    bookListItems(listId: $listId) {
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

export const Success = ({ bookListItems }: CellSuccessProps<BookListItemsQuery>) => {
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
      {bookListItems.map((userBook) => (
        <li key={userBook.id}>
          <Link to={routes.book({ googleId: userBook.googleId })} title={userBook.title}>
            <img src={userBook.coverUrl} alt={`${userBook.title} cover`} className="h-full w-full" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
