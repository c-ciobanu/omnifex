import { render } from '@redwoodjs/testing/web'

import WarningDialog from './WarningDialog'

describe('WarningDialog', () => {
  it('renders successfully', () => {
    expect(() =>
      render(
        <WarningDialog isOpen={true} onClose={jest.fn} onContinue={jest.fn} title="Title" description="Description" />
      )
    ).not.toThrow()
  })
})
