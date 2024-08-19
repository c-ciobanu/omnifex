import { render } from '@redwoodjs/testing/web'

import { standard } from '../DocumentCell.mock'

import LexicalEditor from './LexicalEditor'

describe('LexicalEditor', () => {
  it('renders successfully', () => {
    expect(() => render(<LexicalEditor document={standard().document} />)).not.toThrow()
  })
})
