import { render } from '@redwoodjs/testing/web'

import LexicalEditor from './LexicalEditor'

describe('LexicalEditor', () => {
  it('renders successfully', () => {
    expect(() => render(<LexicalEditor />)).not.toThrow()
  })
})
