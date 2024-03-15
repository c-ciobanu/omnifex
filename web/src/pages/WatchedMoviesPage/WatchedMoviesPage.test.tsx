import { render } from '@redwoodjs/testing/web'

import WatchedMoviesPage from './WatchedMoviesPage'

describe('WatchedMoviesPage', () => {
  it('renders successfully', () => {
    expect(() => render(<WatchedMoviesPage />)).not.toThrow()
  })
})
