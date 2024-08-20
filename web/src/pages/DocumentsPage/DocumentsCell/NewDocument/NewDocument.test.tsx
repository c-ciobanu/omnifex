import { render } from '@redwoodjs/testing/web'

import NewDocument from './NewDocument'

describe('NewDocument', () => {
  it('renders successfully', () => {
    expect(() => render(<NewDocument />)).not.toThrow()
  })
})
