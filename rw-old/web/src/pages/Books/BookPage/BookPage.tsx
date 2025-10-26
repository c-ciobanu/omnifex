import BookCell from './BookCell'

type BookPageProps = {
  googleId: string
}

const BookPage = ({ googleId }: BookPageProps) => {
  return <BookCell googleId={googleId} />
}

export default BookPage
