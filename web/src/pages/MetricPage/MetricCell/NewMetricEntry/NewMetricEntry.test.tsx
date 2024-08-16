import { render } from '@redwoodjs/testing/web'

import { standard } from '../MetricCell.mock'

import NewMetricEntry from './NewMetricEntry'

describe('NewMetricEntry', () => {
  it('renders successfully', () => {
    expect(() => render(<NewMetricEntry metric={standard().metric} />)).not.toThrow()
  })
})
