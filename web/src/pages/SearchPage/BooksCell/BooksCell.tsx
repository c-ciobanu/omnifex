import type { BooksQuery } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

export const QUERY = gql`
  query BooksQuery($title: String!) {
    books(title: $title) {
      coverUrl
      description
      googleId
      publicationDate
      title
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ books }: CellSuccessProps<BooksQuery>) => {
  return (
    <ul className="grid grid-cols-1 divide-y divide-white sm:grid-cols-2 sm:divide-none lg:grid-cols-3">
      {books.map((book) => {
        return (
          <li key={book.googleId}>
            <Link
              to={routes.book({ googleId: book.googleId })}
              title={book.title}
              className="grid grid-cols-[128px_1fr] gap-6 py-6 hover:bg-white"
            >
              <img src={book.coverUrl} alt={`${book.title} cover`} className="h-44 w-full" />
              <div>
                <p>{book.title}</p>
                <p className="text-gray-500">{book.publicationDate?.split('-')[0]}</p>
                <p className="line-clamp-3 text-sm text-gray-500 sm:line-clamp-4">{book.description}</p>
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
