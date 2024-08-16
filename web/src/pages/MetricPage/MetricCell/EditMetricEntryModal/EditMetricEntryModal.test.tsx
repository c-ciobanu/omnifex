import { render } from '@redwoodjs/testing/web'

import { standard } from '../MetricCell.mock'

import NewMetricModal from './EditMetricEntryModal'

describe('NewMetricModal', () => {
  it('renders successfully', () => {
    expect(() =>
      render(
        <NewMetricModal
          isOpen={false}
          setIsOpen={() => {}}
          metric={standard().metric}
          metricEntry={standard().metric.entries[0]}
        />
      )
    ).not.toThrow()
  })
})
