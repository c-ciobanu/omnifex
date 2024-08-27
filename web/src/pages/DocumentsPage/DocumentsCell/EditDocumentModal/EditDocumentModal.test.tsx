import { render } from '@redwoodjs/testing/web'

import { standard } from '../DocumentsCell.mock'

import EditDocumentModal from './EditDocumentModal'

describe('EditDocumentModal', () => {
  it('renders successfully', () => {
    expect(() =>
      render(<EditDocumentModal isOpen={false} setIsOpen={() => {}} document={standard().documents[0]} />)
    ).not.toThrow()
  })
})
