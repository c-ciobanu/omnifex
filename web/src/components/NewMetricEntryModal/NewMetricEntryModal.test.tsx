import { render } from '@redwoodjs/testing/web'

import NewMetricEntryModal from './NewMetricEntryModal'

describe('NewMetricEntryModal', () => {
  it('renders successfully', () => {
    expect(() =>
      render(
        <NewMetricEntryModal
          isOpen={false}
          onClose={() => {}}
          onSubmit={() => {}}
          isSubmitting={false}
          defaultValue="100"
          valueUnit="Kg"
        />
      )
    ).not.toThrow()
  })
})
