import { Eye, EyeOff, Heart, HeartOff, ListMinus, ListPlus } from 'lucide-react'
import { Book } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import { cn } from 'src/lib/utils'
import { QUERY as BookQuery } from 'src/pages/BookPage/BookCell/BookCell'

type ActionsProps = {
  book: Book
}

const CREATE_USER_BOOK = gql`
  mutation CreateUserBookMutation($input: CreateUserBookInput!) {
    createUserBook(input: $input) {
      id
    }
  }
`

const DELETE_USER_BOOK = gql`
  mutation DeleteUserBookMutation($bookId: Int!, $type: UserBookType!) {
    deleteUserBook(bookId: $bookId, type: $type) {
      id
    }
  }
`

const Actions = ({ book }: ActionsProps) => {
  const { id: bookId, googleId, userInfo } = book
  const { favorited, read, inReadingList } = userInfo

  const [createFavorited, { loading: createFavoritedLoading }] = useMutation(CREATE_USER_BOOK, {
    variables: { input: { bookId, type: 'FAVORITED' } },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })
  const [deleteFavorited, { loading: deleteFavoritedLoading }] = useMutation(DELETE_USER_BOOK, {
    variables: { bookId, type: 'FAVORITED' },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })
  const [createRead, { loading: createReadLoading }] = useMutation(CREATE_USER_BOOK, {
    variables: { input: { bookId, type: 'READ' } },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })
  const [deleteRead, { loading: deleteReadLoading }] = useMutation(DELETE_USER_BOOK, {
    variables: { bookId, type: 'READ' },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })
  const [createToRead, { loading: createToReadLoading }] = useMutation(CREATE_USER_BOOK, {
    variables: { input: { bookId, type: 'TO_READ' } },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })
  const [deleteToRead, { loading: deleteToReadLoading }] = useMutation(DELETE_USER_BOOK, {
    variables: { bookId, type: 'TO_READ' },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })

  const toggleFavoritedStatus = () => {
    if (favorited) {
      deleteFavorited()
    } else {
      createFavorited()
    }
  }

  const toggleReadStatus = () => {
    if (read) {
      deleteRead()
    } else {
      createRead()
    }
  }

  const toggleToReadStatus = () => {
    if (inReadingList) {
      deleteToRead()
    } else {
      createToRead()
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={toggleReadStatus}
        disabled={createReadLoading || deleteReadLoading}
        className={cn(
          'flex items-center gap-4 rounded-sm border border-teal-500 px-2 py-3 uppercase',
          read
            ? 'bg-teal-500 text-white hover:border-teal-600 hover:bg-teal-600'
            : 'text-teal-500 hover:bg-teal-500 hover:text-white'
        )}
      >
        {read ? <Eye /> : <EyeOff />}
        <span className="whitespace-nowrap font-medium">{read ? 'Read' : 'Set as read'}</span>
      </button>

      {read ? null : (
        <button
          onClick={toggleToReadStatus}
          disabled={createToReadLoading || deleteToReadLoading}
          className={cn(
            'flex items-center gap-4 rounded-sm border border-sky-500 px-2 py-3 uppercase',
            inReadingList
              ? 'bg-sky-500 text-white hover:border-sky-600 hover:bg-sky-600'
              : 'text-sky-500 hover:bg-sky-500 hover:text-white'
          )}
        >
          {inReadingList ? <ListPlus /> : <ListMinus />}
          <span className="whitespace-nowrap font-medium">
            {inReadingList ? 'Listed on reading list' : 'Add to reading list'}
          </span>
        </button>
      )}

      <button
        onClick={toggleFavoritedStatus}
        disabled={createFavoritedLoading || deleteFavoritedLoading}
        className={cn(
          'flex items-center gap-4 rounded-sm border border-red-500 px-2 py-3 uppercase',
          favorited
            ? 'bg-red-500 text-white hover:border-red-600 hover:bg-red-600'
            : 'text-red-500 hover:bg-red-500 hover:text-white'
        )}
      >
        {favorited ? <Heart /> : <HeartOff />}
        <span className="whitespace-nowrap font-medium">{favorited ? 'Favorited' : 'Add to favorites'}</span>
      </button>
    </div>
  )
}

export default Actions
