import { render } from '@redwoodjs/testing/web'

import MovieActions from './MovieActions'

describe('MovieActions', () => {
  it('renders successfully', () => {
    expect(() =>
      render(<MovieActions id={1} userState={{ favorited: true, watched: false, watchlisted: true }} />)
    ).not.toThrow()
  })
})
