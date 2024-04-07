import { render } from '@redwoodjs/testing/web'

import UserMoviesWatchlistPage from './UserMoviesWatchlistPage'

describe('UserMoviesWatchlistPage', () => {
  it('renders successfully', () => {
    expect(() => render(<UserMoviesWatchlistPage />)).not.toThrow()
  })
})
