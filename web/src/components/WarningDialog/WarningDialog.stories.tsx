import type { Meta, StoryObj } from '@storybook/react'

import WarningDialog from './WarningDialog'

const meta: Meta<typeof WarningDialog> = {
  component: WarningDialog,
}

export default meta

type Story = StoryObj<typeof WarningDialog>

export const Primary: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onContinue: () => {},
    title: 'Title',
    description: 'Description',
  },
}
