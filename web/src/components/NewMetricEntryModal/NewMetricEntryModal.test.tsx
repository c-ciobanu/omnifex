import { render } from '@redwoodjs/testing/web'

import NewMetricEntryModal from './NewMetricEntryModal'

describe('NewMetricEntryModal', () => {
  it('renders successfully', () => {
    expect(() =>
      render(
        <NewMetricEntryModal
          trigger={(onClick) => <button onClick={onClick}>Open</button>}
          defaultValue="100"
          valueUnit="Kg"
        />
      )
    ).not.toThrow()
  })
})
