import { render } from '@redwoodjs/testing/web'

import { standard } from '../MetricsCell.mock'

import NewMetricModal from './EditMetricModal'

describe('NewMetricModal', () => {
  it('renders successfully', () => {
    expect(() =>
      render(<NewMetricModal isOpen={false} setIsOpen={() => {}} metric={standard().metrics[0]} />)
    ).not.toThrow()
  })
})
