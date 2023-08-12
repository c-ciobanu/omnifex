import { render } from '@redwoodjs/testing/web'

import MoviePage from './MoviePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('MoviePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MoviePage id={1} />)
    }).not.toThrow()
  })
})
