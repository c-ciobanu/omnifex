import type { Meta, StoryObj } from '@storybook/react'

import { standard } from 'src/components/MovieCell/MovieCell.mock'

import Movie from './Movie'

const meta: Meta<typeof Movie> = {
  component: Movie,
}

export default meta

type Story = StoryObj<typeof Movie>

export const Primary: Story = {
  args: {
    movie: standard().movie,
  },
}
