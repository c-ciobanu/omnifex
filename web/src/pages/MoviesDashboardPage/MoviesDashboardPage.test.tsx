import { render } from '@redwoodjs/testing/web'

import MoviesDashboardPage from './MoviesDashboardPage'

describe('MoviesDashboardPage', () => {
  it('renders successfully', () => {
    expect(() => render(<MoviesDashboardPage />)).not.toThrow()
  })
})
