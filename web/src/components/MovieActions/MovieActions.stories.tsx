import type { Meta, StoryObj } from '@storybook/react'

import { standard } from 'src/components/MovieCell/MovieCell.mock'

import MovieActions from './MovieActions'

const meta: Meta<typeof MovieActions> = {
  component: MovieActions,
}

export default meta

type Story = StoryObj<typeof MovieActions>

export const Primary: Story = {
  args: {
    movie: standard().movie,
  },
}
