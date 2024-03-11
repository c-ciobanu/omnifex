import { render } from '@redwoodjs/testing/web'

import { standard } from 'src/components/MovieCell/MovieCell.mock'

import MovieActions from './MovieActions'

describe('MovieActions', () => {
  it('renders successfully', () => {
    expect(() =>
      render(
        <MovieActions movie={{ ...standard().movie, user: { favorited: true, watched: false, watchlisted: true } }} />
      )
    ).not.toThrow()
  })
})
