import { render } from '@redwoodjs/testing/web'

import BooksDashboardPage from './BooksDashboardPage'

describe('BooksDashboardPage', () => {
  it('renders successfully', () => {
    expect(() => render(<BooksDashboardPage />)).not.toThrow()
  })
})
