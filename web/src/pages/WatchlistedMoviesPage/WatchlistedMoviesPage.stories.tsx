import type { Meta, StoryObj } from '@storybook/react'

import WatchlistedMoviesPage from './WatchlistedMoviesPage'

const meta: Meta<typeof WatchlistedMoviesPage> = {
  component: WatchlistedMoviesPage,
}

export default meta

type Story = StoryObj<typeof WatchlistedMoviesPage>

export const Primary: Story = {}
