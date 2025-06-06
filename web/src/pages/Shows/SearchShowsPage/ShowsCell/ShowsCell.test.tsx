import { render, screen } from '@redwoodjs/testing/web'

import { Loading, Empty, Failure, Success } from './ShowsCell'
import { standard } from './ShowsCell.mock'

describe('ShowsCell', () => {
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
    const shows = standard().shows
    render(<Success shows={shows} title="the office" />)

    shows.forEach((show) => {
      expect(screen.getByText(show.overview)).toBeInTheDocument()
      expect(screen.getByText(show.releaseYear)).toBeInTheDocument()
    })
  })
})
