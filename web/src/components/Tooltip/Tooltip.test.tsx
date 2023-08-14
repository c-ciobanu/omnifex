import { render } from '@redwoodjs/testing/web'

import Tooltip from './Tooltip'

describe('Tooltip', () => {
  it('renders successfully', () => {
    expect(() =>
      render(
        <Tooltip content="Tooltip content">
          <button>Hover me!</button>
        </Tooltip>
      )
    ).not.toThrow()
  })
})
