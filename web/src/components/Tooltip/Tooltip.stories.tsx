import type { Meta, StoryObj } from '@storybook/react'

import Tooltip from './Tooltip'

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
}

export default meta

type Story = StoryObj<typeof Tooltip>

export const Primary: Story = {
  args: {
    content: 'Tooltip content',
    children: <button>Hover me!</button>,
  },
}
