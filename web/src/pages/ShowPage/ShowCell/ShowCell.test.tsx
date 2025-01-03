import { render, screen } from '@redwoodjs/testing/web'

import { Empty, Failure, Loading, Success } from './ShowCell'
import { standard } from './ShowCell.mock'

describe('ShowCell', () => {
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
    const show = standard().show
    render(<Success show={standard().show} />)

    expect(screen.getByText(show.title)).toBeInTheDocument()
  })
})
