import { render } from '@redwoodjs/testing/web'

import TrackerPage from './TrackerPage'

describe('TrackerPage', () => {
  it('renders successfully', () => {
    expect(() => render(<TrackerPage />)).not.toThrow()
  })
})
