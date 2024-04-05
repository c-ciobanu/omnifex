import { render } from '@redwoodjs/testing/web'

import { standard } from 'src/pages/MoviePage/MovieCell/MovieCell.mock'

import Actions from './Actions'

describe('MovieActions', () => {
  it('renders successfully', () => {
    expect(() =>
      render(
        <Actions
          movie={{ ...standard().movie, userInteractions: { favorited: true, watched: false, watchlisted: true } }}
        />
      )
    ).not.toThrow()
  })
})
