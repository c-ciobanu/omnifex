import type { Meta, StoryObj } from '@storybook/react'

import MovieActions from './MovieActions'

const meta: Meta<typeof MovieActions> = {
  component: MovieActions,
}

export default meta

type Story = StoryObj<typeof MovieActions>

export const Primary: Story = {
  args: {
    id: 1,
    statuses: {
      favorited: true,
      watched: false,
    },
  },
}
