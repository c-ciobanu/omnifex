import { Eye, EyeOff, ListMinus, ListPlus } from 'lucide-react'
import { BookQuery } from 'types/graphql'

import { useMutation } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import { cn } from 'src/lib/utils'
import { QUERY as BookCellQuery } from 'src/pages/Books/BookPage/BookCell/BookCell'

type ActionsProps = {
  book: BookQuery['book']
}

const READ_BOOK_MUTATION = gql`
  mutation ReadBookMutation($id: Int!) {
    readBook(id: $id) {
      id
    }
  }
`

const UNREAD_BOOK_MUTATION = gql`
  mutation UnreadBookMutation($id: Int!) {
    unreadBook(id: $id) {
      id
    }
  }
`

const READING_LIST_BOOK_MUTATION = gql`
  mutation ReadingListBookMutation($id: Int!) {
    readingListBook(id: $id) {
      id
    }
  }
`

const UNREADING_LIST_BOOK_MUTATION = gql`
  mutation UnreadinglistBookMutation($id: Int!) {
    unreadingListBook(id: $id) {
      id
    }
  }
`

const Actions = ({ book }: ActionsProps) => {
  const { id, googleId, userInfo } = book
  const { read, inReadingList } = userInfo

  const [createRead, { loading: createReadLoading }] = useMutation(READ_BOOK_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: BookCellQuery, variables: { googleId } }],
  })
  const [deleteRead, { loading: deleteReadLoading }] = useMutation(UNREAD_BOOK_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: BookCellQuery, variables: { googleId } }],
  })
  const [createToRead, { loading: createToReadLoading }] = useMutation(READING_LIST_BOOK_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: BookCellQuery, variables: { googleId } }],
  })
  const [deleteToRead, { loading: deleteToReadLoading }] = useMutation(UNREADING_LIST_BOOK_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: BookCellQuery, variables: { googleId } }],
  })

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
      <Button
        onClick={toggleReadStatus}
        disabled={createReadLoading || deleteReadLoading}
        variant="outline"
        className={cn(
          'h-12 justify-start gap-4 border-teal-500 px-2 text-base uppercase',
          read
            ? 'bg-teal-500 text-white hover:border-teal-600 hover:bg-teal-600 hover:text-white'
            : 'text-teal-500 hover:bg-teal-500 hover:text-white'
        )}
      >
        {read ? <Eye /> : <EyeOff />}
        <span>{read ? 'Read' : 'Set as read'}</span>
      </Button>

      {read ? null : (
        <Button
          onClick={toggleToReadStatus}
          disabled={createToReadLoading || deleteToReadLoading}
          variant="outline"
          className={cn(
            'h-12 justify-start gap-4 border-sky-500 px-2 text-base uppercase',
            inReadingList
              ? 'bg-sky-500 text-white hover:border-sky-600 hover:bg-sky-600 hover:text-white'
              : 'text-sky-500 hover:bg-sky-500 hover:text-white'
          )}
        >
          {inReadingList ? <ListPlus /> : <ListMinus />}
          <span>{inReadingList ? 'Listed on reading list' : 'Add to reading list'}</span>
        </Button>
      )}
    </div>
  )
}

export default Actions
