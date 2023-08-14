import { ReactNode } from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'

type TooltipProps = {
  children: ReactNode
  content: string
}

const Tooltip = ({ children, content }: TooltipProps) => {
  return (
    <TooltipPrimitive.Provider delayDuration={500} skipDelayDuration={250}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          sideOffset={5}
          className="rounded-md bg-white px-4 py-2 text-black"
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-white" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export default Tooltip
