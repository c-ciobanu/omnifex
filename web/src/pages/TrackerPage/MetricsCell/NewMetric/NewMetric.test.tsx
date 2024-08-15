import { render } from '@redwoodjs/testing/web'

import NewMetric from './NewMetric'

describe('NewMetric', () => {
  it('renders successfully', () => {
    expect(() => render(<NewMetric />)).not.toThrow()
  })
})
