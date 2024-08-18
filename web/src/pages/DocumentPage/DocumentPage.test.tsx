import { render } from '@redwoodjs/testing/web'

import DocumentPage from './DocumentPage'

describe('DocumentPage', () => {
  it('renders successfully', () => {
    expect(() => render(<DocumentPage id="1" />)).not.toThrow()
  })
})
