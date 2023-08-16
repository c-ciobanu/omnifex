import { ReactNode } from 'react'

import * as TooltipPrimitive from '@radix-ui/react-tooltip'

type TooltipProps = {
  children: ReactNode
  content: string
}

const Tooltip = ({ children, content }: TooltipProps) => {
  return (
    <TooltipPrimitive.Provider delayDuration={250} skipDelayDuration={250}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          sideOffset={5}
          className="select-none rounded-md bg-white px-4 py-2 leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]"
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-white" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

export default Tooltip
