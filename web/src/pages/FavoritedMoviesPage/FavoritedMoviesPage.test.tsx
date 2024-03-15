import { render } from '@redwoodjs/testing/web'

import FavoritedMoviesPage from './FavoritedMoviesPage'

describe('FavoritedMoviesPage', () => {
  it('renders successfully', () => {
    expect(() => render(<FavoritedMoviesPage />)).not.toThrow()
  })
})
