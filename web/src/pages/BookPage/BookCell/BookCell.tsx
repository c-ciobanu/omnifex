import type { BookQuery } from 'types/graphql'

import { type CellSuccessProps, type CellFailureProps, Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'

import Actions from './Actions'

export const QUERY = gql`
  query BookQuery($googleId: String!) {
    book(googleId: $googleId) {
      id
      authors
      coverUrl
      description
      genres
      googleId
      pages
      publicationDate
      subtitle
      title
      userInfo {
        read
        inReadingList
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ book }: CellSuccessProps<BookQuery>) => {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Metadata title={book.title} description={book.description} />

      <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
        <div>
          <h2 className="text-2xl font-bold">
            {book.title}
            {book.subtitle ? `: ${book.subtitle}` : undefined}
          </h2>
          <div>By {book.authors.join(', ')}</div>
          <h4 className="text-gray-400">
            {book.publicationDate?.split('-')[0]} · {book.pages} pages
          </h4>

          <div className="mt-6 flex items-start gap-6">
            <img src={book.coverUrl} alt={`${book.title} cover`} className="w-1/4" />

            <div className="space-y-3">
              {book.genres ? (
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {book.genres.map((genre) => (
                    <span
                      key={genre}
                      className="nline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              ) : null}
              <div dangerouslySetInnerHTML={{ __html: book.description }} className="prose max-w-none" />
            </div>
          </div>
        </div>

        {isAuthenticated ? (
          <div className="lg:w-72 lg:flex-shrink-0">
            <Actions book={book} />
          </div>
        ) : null}
      </div>
    </>
  )
}
