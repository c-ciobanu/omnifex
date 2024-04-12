import { render } from '@redwoodjs/testing/web'

import { standard } from 'src/pages/BookPage/BookCell/BookCell.mock'

import Actions from './Actions'

describe('BookActions', () => {
  it('renders successfully', () => {
    expect(() =>
      render(<Actions book={{ ...standard().book, userInfo: { favorited: true, read: false, inReadingList: true } }} />)
    ).not.toThrow()
  })
})
