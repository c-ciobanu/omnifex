import { render, screen } from '@redwoodjs/testing/web'

import { Loading, Empty, Failure, Success } from './BooksCell'
import { standard } from './BooksCell.mock'

describe('BooksCell', () => {
  it('renders Loading successfully', () => {
    expect(() => render(<Loading />)).not.toThrow()
  })

  it('renders Empty successfully', async () => {
    expect(() => render(<Empty />)).not.toThrow()
  })

  it('renders Failure successfully', async () => {
    expect(() => render(<Failure error={new Error('Oh no')} />)).not.toThrow()
  })

  it('renders Success successfully', async () => {
    const books = standard().books
    render(<Success books={books} />)

    books.forEach((book) => {
      expect(screen.getByText(book.title)).toBeInTheDocument()
      expect(screen.getByText(book.publicationYear)).toBeInTheDocument()
    })
  })
})
