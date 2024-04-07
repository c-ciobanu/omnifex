import { render } from '@redwoodjs/testing/web'

import UserReadBooksPage from './UserReadBooksPage'

describe('UserReadBooksPage', () => {
  it('renders successfully', () => {
    expect(() => render(<UserReadBooksPage />)).not.toThrow()
  })
})
