import { render } from '@redwoodjs/testing/web'

import MetricPage from './MetricPage'

describe('MetricPage', () => {
  it('renders successfully', () => {
    expect(() => render(<MetricPage id={1} />)).not.toThrow()
  })
})
