import { render } from '@redwoodjs/testing/web'

import NewMetricModal from './NewMetricModal'

describe('NewMetricModal', () => {
  it('renders successfully', () => {
    expect(() =>
      render(
        <NewMetricModal
          trigger={<button>Open</button>}
          isOpen={false}
          setIsOpen={() => {}}
          onSubmit={() => {}}
          isSubmitting={false}
        />
      )
    ).not.toThrow()
  })
})
