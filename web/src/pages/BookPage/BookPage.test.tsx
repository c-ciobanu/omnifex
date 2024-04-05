import { render } from '@redwoodjs/testing/web'

import BookPage from './BookPage'

describe('BookPage', () => {
  it('renders successfully', () => {
    expect(() => render(<BookPage googleId="1" />)).not.toThrow()
  })
})
