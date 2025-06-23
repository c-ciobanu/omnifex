import { render } from '@cedarjs/testing/web'

import { Loading, Empty, Failure, Success } from './DocumentCell'
import { standard } from './DocumentCell.mock'

describe('DocumentCell', () => {
  it('renders Loading successfully', () => {
    expect(() => render(<Loading />)).not.toThrow()
  })

  it('renders Empty successfully', async () => {
    expect(() => render(<Empty />)).not.toThrow()
  })

  it('renders Failure successfully', async () => {
    expect(() => render(<Failure error={new Error('Oh no')} id="1" />)).not.toThrow()
  })

  it('renders Success successfully', async () => {
    expect(() => render(<Success document={standard().document} id="1" />)).not.toThrow()
  })
})
