import { render } from '@redwoodjs/testing/web'

import UserWatchedMoviesPage from './UserWatchedMoviesPage'

describe('UserWatchedMoviesPage', () => {
  it('renders successfully', () => {
    expect(() => render(<UserWatchedMoviesPage />)).not.toThrow()
  })
})
