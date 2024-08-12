import { render } from '@redwoodjs/testing/web'

import NewMetricModal from './NewMetricModal'

describe('NewMetricModal', () => {
  it('renders successfully', () => {
    expect(() =>
      render(<NewMetricModal isOpen={false} onClose={() => {}} onSubmit={() => {}} isSubmitting={false} />)
    ).not.toThrow()
  })
})
