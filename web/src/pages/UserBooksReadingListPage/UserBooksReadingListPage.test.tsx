import { render } from '@redwoodjs/testing/web'

import UserBooksReadingListPage from './UserBooksReadingListPage'

describe('UserBooksReadingListPage', () => {
  it('renders successfully', () => {
    expect(() => render(<UserBooksReadingListPage />)).not.toThrow()
  })
})
