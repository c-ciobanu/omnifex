import { render } from '@redwoodjs/testing/web'

import PomodoroPage from './PomodoroPage'

describe('PomodoroPage', () => {
  it('renders successfully', () => {
    expect(() => render(<PomodoroPage />)).not.toThrow()
  })
})
