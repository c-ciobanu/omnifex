import {
  faEye as faRegularEye,
  faHeart as faRegularHeart,
  faRectangleList as faRegularRectangleList,
} from '@fortawesome/free-regular-svg-icons'
import {
  faEye as faSolidEye,
  faHeart as faSolidHeart,
  faRectangleList as faSolidRectangleList,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { Book } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'src/components/Tooltip'
import { QUERY as BookQuery } from 'src/pages/BookPage/BookCell/BookCell'

type ActionsProps = {
  book: Book
}

const CREATE_FAVORITED_BOOK = gql`
  mutation CreateFavoritedBookMutation($input: CreateUserBookInput!) {
    createFavoritedBook(input: $input) {
      id
    }
  }
`

const DELETE_FAVORITED_BOOK = gql`
  mutation DeleteFavoritedBookMutation($bookId: Int!) {
    deleteFavoritedBook(bookId: $bookId) {
      id
    }
  }
`

const CREATE_READ_BOOK = gql`
  mutation CreateReadBookMutation($input: CreateUserBookInput!) {
    createReadBook(input: $input) {
      id
    }
  }
`

const DELETE_READ_BOOK = gql`
  mutation DeleteReadBookMutation($bookId: Int!) {
    deleteReadBook(bookId: $bookId) {
      id
    }
  }
`

const CREATE_TO_READ_BOOK = gql`
  mutation CreateToReadBookMutation($input: CreateUserBookInput!) {
    createToReadBook(input: $input) {
      id
    }
  }
`

const DELETE_TO_READ_BOOK = gql`
  mutation DeleteToReadBookMutation($bookId: Int!) {
    deleteToReadBook(bookId: $bookId) {
      id
    }
  }
`

const Actions = ({ book }: ActionsProps) => {
  const { id: bookId, googleId, userInfo } = book
  const { favorited, read, inReadingList } = userInfo

  const [createFavorited, { loading: createFavoritedLoading }] = useMutation(CREATE_FAVORITED_BOOK, {
    variables: { input: { bookId } },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })
  const [deleteFavorited, { loading: deleteFavoritedLoading }] = useMutation(DELETE_FAVORITED_BOOK, {
    variables: { bookId },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })
  const [createRead, { loading: createReadLoading }] = useMutation(CREATE_READ_BOOK, {
    variables: { input: { bookId } },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })
  const [deleteRead, { loading: deleteReadLoading }] = useMutation(DELETE_READ_BOOK, {
    variables: { bookId },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })
  const [createToRead, { loading: createToReadLoading }] = useMutation(CREATE_TO_READ_BOOK, {
    variables: { input: { bookId } },
    refetchQueries: [{ query: BookQuery, variables: { googleId } }],
  })
  const [deleteToRead, { loading: deleteToReadLoading }] = useMutation(DELETE_TO_READ_BOOK, {
    variables: { bookId },
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
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleReadStatus}
              disabled={createReadLoading || deleteReadLoading}
              className={clsx(
                'flex items-center gap-2 rounded-sm border border-teal-500 px-2 py-3 uppercase',
                read
                  ? 'bg-teal-500 text-white hover:border-teal-600 hover:bg-teal-600'
                  : 'text-teal-500 hover:bg-teal-500 hover:text-white'
              )}
            >
              <FontAwesomeIcon icon={read ? faSolidEye : faRegularEye} className="text-3xl" />
              <span className="whitespace-nowrap font-medium">{read ? 'Read' : 'Set as read'}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{read ? 'Remove from read books' : 'Set as read'}</p>
          </TooltipContent>
        </Tooltip>

        {read ? null : (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleToReadStatus}
                disabled={createToReadLoading || deleteToReadLoading}
                className={clsx(
                  'flex items-center gap-2 rounded-sm border border-sky-500 px-2 py-3 uppercase',
                  inReadingList
                    ? 'bg-sky-500 text-white hover:border-sky-600 hover:bg-sky-600'
                    : 'text-sky-500 hover:bg-sky-500 hover:text-white'
                )}
              >
                <FontAwesomeIcon
                  icon={inReadingList ? faSolidRectangleList : faRegularRectangleList}
                  className="text-3xl"
                />
                <span className="whitespace-nowrap font-medium">
                  {inReadingList ? 'Listed on reading list' : 'Add to reading list'}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{inReadingList ? 'Remove from books reading list' : 'Add to reading list'}</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleFavoritedStatus}
              disabled={createFavoritedLoading || deleteFavoritedLoading}
              className={clsx(
                'flex items-center gap-2 rounded-sm border border-red-500 px-2 py-3 uppercase',
                favorited
                  ? 'bg-red-500 text-white hover:border-red-600 hover:bg-red-600'
                  : 'text-red-500 hover:bg-red-500 hover:text-white'
              )}
            >
              <FontAwesomeIcon icon={favorited ? faSolidHeart : faRegularHeart} className="text-3xl" />
              <span className="whitespace-nowrap font-medium">{favorited ? 'Favorited' : 'Add to favorites'}</span>
            </button>
          </TooltipTrigger>
          <TooltipContent className="w-full">
            <p>{favorited ? 'Remove from favorites' : 'Add to favorites'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default Actions
