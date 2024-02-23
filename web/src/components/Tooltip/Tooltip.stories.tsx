import type { Meta, StoryObj } from '@storybook/react'

import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './Tooltip'

const Component = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button>Hover me!</button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tooltip content</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const meta: Meta<typeof Component> = {
  component: Component,
}

export default meta

type Story = StoryObj<typeof Component>

export const Primary: Story = {}
