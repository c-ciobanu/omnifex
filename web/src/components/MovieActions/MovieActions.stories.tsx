import type { Meta, StoryObj } from '@storybook/react'

import MovieActions from './MovieActions'

const meta: Meta<typeof MovieActions> = {
  component: MovieActions,
}

export default meta

type Story = StoryObj<typeof MovieActions>

export const Primary: Story = {
  args: {
    tmdbId: 1,
    userState: {
      favorited: true,
      watched: false,
      watchlisted: true,
    },
  },
}
