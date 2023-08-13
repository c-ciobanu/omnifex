import type { Meta, StoryObj } from '@storybook/react'

import { Loading, Empty, Failure, Success } from './MovieCell'
import { standard } from './MovieCell.mock'

const meta: Meta = {
  title: 'Cells/MovieCell',
}

export default meta

export const loading: StoryObj<typeof Loading> = {
  render: () => {
    return Loading ? <Loading /> : <></>
  },
}

export const empty: StoryObj<typeof Empty> = {
  render: () => {
    return Empty ? <Empty /> : <></>
  },
}

export const failure: StoryObj<typeof Failure> = {
  render: (args) => {
    return Failure ? <Failure error={new Error('Oh no')} {...args} /> : <></>
  },
}

export const success: StoryObj<typeof Success> = {
  render: (args) => {
    return Success ? <Success movie={standard().movie} {...args} /> : <></>
  },
}
