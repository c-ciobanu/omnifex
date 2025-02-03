import { render } from '@redwoodjs/testing/web'

import { Empty, Failure, Loading, Success } from './SeasonCell'
import { standard } from './SeasonCell.mock'

describe('SeasonCell', () => {
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
    render(<Success {...standard()} showTmdbId={1398} seasonNumber={1} />)
  })
})
