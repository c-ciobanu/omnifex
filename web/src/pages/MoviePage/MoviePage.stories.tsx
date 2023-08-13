import type { Meta, StoryObj } from '@storybook/react'

import MoviePage from './MoviePage'

const meta: Meta<typeof MoviePage> = {
  component: MoviePage,
}

export default meta

type Story = StoryObj<typeof MoviePage>

export const Primary: Story = {}

Primary.parameters = {
  layout: 'fullscreen',
}
