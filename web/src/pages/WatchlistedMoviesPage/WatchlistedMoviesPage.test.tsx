import { render } from '@redwoodjs/testing/web'

import WatchlistedMoviesPage from './WatchlistedMoviesPage'

describe('WatchlistedMoviesPage', () => {
  it('renders successfully', () => {
    expect(() => render(<WatchlistedMoviesPage />)).not.toThrow()
  })
})
