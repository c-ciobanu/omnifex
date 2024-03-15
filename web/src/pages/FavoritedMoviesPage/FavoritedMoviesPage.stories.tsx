import type { Meta, StoryObj } from '@storybook/react'

import FavoritedMoviesPage from './FavoritedMoviesPage'

const meta: Meta<typeof FavoritedMoviesPage> = {
  component: FavoritedMoviesPage,
}

export default meta

type Story = StoryObj<typeof FavoritedMoviesPage>

export const Primary: Story = {}
