import { render, screen } from '@redwoodjs/testing/web'

import { standard } from 'src/components/MovieCell/MovieCell.mock'

import Movie, { formatMinutesToHoursAndMinutes } from './Movie'

describe('Movie', () => {
  it('renders successfully', () => {
    const movie = standard().movie
    render(<Movie movie={movie} />)

    const runtimeText = formatMinutesToHoursAndMinutes(movie.runtime)

    expect(screen.getByText(movie.title)).toBeInTheDocument()
    expect(screen.queryByText(movie.runtime)).not.toBeInTheDocument()
    expect(screen.queryByText(runtimeText, { exact: false })).toBeInTheDocument()
  })
})
