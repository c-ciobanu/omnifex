import { render, screen } from '@redwoodjs/testing/web'

import {
  Loading,
  Empty,
  Failure,
  Success,
  formatMinutesToHoursAndMinutes,
} from './MovieCell'
import { standard } from './MovieCell.mock'

describe('MovieCell', () => {
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
    const movie = standard().movie
    render(<Success movie={movie} />)

    const runtimeText = formatMinutesToHoursAndMinutes(movie.runtime)

    expect(screen.getByText(movie.title)).toBeInTheDocument()
    expect(screen.queryByText(movie.runtime)).not.toBeInTheDocument()
    expect(
      screen.queryByText(runtimeText, { exact: false })
    ).toBeInTheDocument()
  })
})
