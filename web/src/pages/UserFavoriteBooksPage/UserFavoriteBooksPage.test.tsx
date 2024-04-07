import { render } from '@redwoodjs/testing/web'

import UserFavoriteBooksPage from './UserFavoriteBooksPage'

describe('UserFavoriteBooksPage', () => {
  it('renders successfully', () => {
    expect(() => render(<UserFavoriteBooksPage />)).not.toThrow()
  })
})
