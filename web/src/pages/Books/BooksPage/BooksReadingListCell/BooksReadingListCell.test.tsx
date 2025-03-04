import { render } from '@redwoodjs/testing/web'

import { Loading, Empty, Failure, Success } from './BooksReadingListCell'
import { standard } from './BooksReadingListCell.mock'

describe('BooksReadingListCell', () => {
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
    expect(() => render(<Success {...standard()} />)).not.toThrow()
  })
})
