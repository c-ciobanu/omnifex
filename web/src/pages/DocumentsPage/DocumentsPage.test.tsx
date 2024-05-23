import { render } from '@redwoodjs/testing/web'

import DocumentsPage from './DocumentsPage'

describe('DocumentsPage', () => {
  it('renders successfully', () => {
    expect(() => render(<DocumentsPage />)).not.toThrow()
  })
})
