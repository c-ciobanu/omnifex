import type { Meta, StoryObj } from '@storybook/react'

import WatchedMoviesPage from './WatchedMoviesPage'

const meta: Meta<typeof WatchedMoviesPage> = {
  component: WatchedMoviesPage,
}

export default meta

type Story = StoryObj<typeof WatchedMoviesPage>

export const Primary: Story = {}
