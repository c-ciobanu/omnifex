import { render } from '@redwoodjs/testing/web'

import { standard } from 'src/pages/MoviePage/MovieCell/MovieCell.mock'

import Actions from './Actions'

describe('MovieActions', () => {
  it('renders successfully', () => {
    expect(() =>
      render(
        <Actions movie={{ ...standard().movie, userInfo: { favorited: true, watched: false, inWatchlist: true } }} />
      )
    ).not.toThrow()
  })
})
