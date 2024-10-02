import { render } from '@redwoodjs/testing/web'

import PomodoroTimer from './PomodoroTimer'

describe('PomodoroTimer', () => {
  it('renders successfully', () => {
    expect(() => render(<PomodoroTimer settings={{ pomodoro: 25, shortBreak: 5, longBreak: 20 }} />)).not.toThrow()
  })
})
