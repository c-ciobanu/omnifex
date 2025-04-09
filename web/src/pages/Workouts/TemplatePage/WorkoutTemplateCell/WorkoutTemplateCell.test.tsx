import { render } from '@redwoodjs/testing/web'

import { Loading, Empty, Failure, Success } from './WorkoutTemplateCell'
import { standard } from './WorkoutTemplateCell.mock'

describe('WorkoutTemplateCell', () => {
  it('renders Loading successfully', () => {
    expect(() => render(<Loading />)).not.toThrow()
  })

  it('renders Empty successfully', async () => {
    expect(() => render(<Empty />)).not.toThrow()
  })

  it('renders Failure successfully', async () => {
    expect(() => render(<Failure error={new Error('Oh no')} id={1} />)).not.toThrow()
  })

  it('renders Success successfully', async () => {
    expect(() => render(<Success workoutTemplate={standard().workoutTemplate} id={1} />)).not.toThrow()
  })
})
