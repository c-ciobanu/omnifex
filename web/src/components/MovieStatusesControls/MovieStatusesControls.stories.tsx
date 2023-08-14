import type { Meta, StoryObj } from '@storybook/react'

import MovieStatusesControls from './MovieStatusesControls'

const meta: Meta<typeof MovieStatusesControls> = {
  component: MovieStatusesControls,
}

export default meta

type Story = StoryObj<typeof MovieStatusesControls>

export const Primary: Story = {
  args: {
    id: 1,
  },
}
