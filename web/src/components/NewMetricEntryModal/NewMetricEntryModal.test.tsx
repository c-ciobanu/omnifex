import { render } from '@redwoodjs/testing/web'

import { standard } from 'src/pages/MetricPage/MetricCell/MetricCell.mock'

import NewMetricEntryModal from './NewMetricEntryModal'

describe('NewMetricEntryModal', () => {
  it('renders successfully', () => {
    expect(() =>
      render(
        <NewMetricEntryModal
          isOpen={false}
          setIsOpen={() => {}}
          metric={standard().metric}
          latestEntry={standard().metric.entries[0]}
          onCompleted={() => {}}
        />
      )
    ).not.toThrow()
  })
})
