import { render, screen } from '@redwoodjs/testing/web'

import { Loading, Empty, Failure, Success } from './MoviesCell'
import { standard } from './MoviesCell.mock'

describe('MoviesCell', () => {
  it('renders Loading successfully', () => {
    expect(() => render(<Loading />)).not.toThrow()
  })

  it('renders Empty successfully', async () => {
    expect(() => render(<Empty />)).not.toThrow()
  })

  it('renders Failure successfully', async () => {
    expect(() => render(<Failure error={new Error('Oh no')} />)).not.toThrow()
  })

  it('renders Success successfully', async () => {
    const movies = standard().movies
    render(<Success movies={movies} title="iron man" />)

    movies.forEach((movie) => {
      expect(screen.getByText(movie.title)).toBeInTheDocument()
      expect(screen.getByText(movie.releaseYear)).toBeInTheDocument()
    })
  })
})
