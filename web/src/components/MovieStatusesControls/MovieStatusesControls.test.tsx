import { render } from '@redwoodjs/testing/web'

import MovieStatusesControls from './MovieStatusesControls'

describe('MovieStatusesControls', () => {
  it('renders successfully', () => {
    expect(() => render(<MovieStatusesControls id={1} />)).not.toThrow()
  })
})
