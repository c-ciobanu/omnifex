import { render } from '@redwoodjs/testing/web'

import UserFavoriteMoviesPage from './UserFavoriteMoviesPage'

describe('UserFavoriteMoviesPage', () => {
  it('renders successfully', () => {
    expect(() => render(<UserFavoriteMoviesPage />)).not.toThrow()
  })
})
