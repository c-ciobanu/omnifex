import { render } from '@redwoodjs/testing/web'

import MoviePage from './MoviePage'

describe('MoviePage', () => {
  it('renders successfully', () => {
    expect(() => render(<MoviePage id={1} />)).not.toThrow()
  })
})
