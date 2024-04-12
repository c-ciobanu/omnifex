import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import clsx from 'clsx'

export const TooltipProvider = ({ delayDuration = 300, ...props }: TooltipPrimitive.TooltipProviderProps) => {
  return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />
}

export const Tooltip = TooltipPrimitive.Root

export const TooltipTrigger = TooltipPrimitive.Trigger

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  return (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={clsx(
        'z-50 select-none rounded-md border bg-white px-3 py-1.5 text-sm text-black shadow-md',
        className
      )}
      {...props}
    />
  )
})
