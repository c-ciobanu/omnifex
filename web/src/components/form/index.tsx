import * as React from 'react'

import { Slot, Label as LabelPrimitive } from 'radix-ui'

import {
  useRegister,
  useFormContext,
  Form,
  Controller,
  FieldPath,
  FieldValues,
  RedwoodRegisterOptions,
  Submit,
} from '@redwoodjs/forms'

import { buttonVariants } from 'src/components/ui/button'
import { Label } from 'src/components/ui/label'
import { cn } from 'src/lib/utils'

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue)

type FormFieldProps = {
  name: string
  validation: RedwoodRegisterOptions
  render: (register: ReturnType<typeof useRegister>) => React.ReactNode
}

const FormField = (props: FormFieldProps) => {
  const register = useRegister({ name: props.name, validation: props.validation })

  return <FormFieldContext.Provider value={{ name: props.name }}>{props.render(register)}</FormFieldContext.Provider>
}

const ControlledFormField = (props: React.ComponentPropsWithoutRef<typeof Controller>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>')
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

const FormItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const id = React.useId()

    return (
      <FormItemContext.Provider value={{ id }}>
        <div ref={ref} className={cn('space-y-2', className)} {...props} />
      </FormItemContext.Provider>
    )
  }
)
FormItem.displayName = 'FormItem'

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return <Label ref={ref} className={cn(error && 'text-destructive', className)} htmlFor={formItemId} {...props} />
})
FormLabel.displayName = 'FormLabel'

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot.Root>,
  React.ComponentPropsWithoutRef<typeof Slot.Root>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot.Root
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = 'FormControl'

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField()

    return (
      <p ref={ref} id={formDescriptionId} className={cn('text-[0.8rem] text-muted-foreground', className)} {...props} />
    )
  }
)
FormDescription.displayName = 'FormDescription'

const defaultErrorMessages = {
  required: 'is required',
  pattern: 'is not formatted correctly',
  minLength: 'is too short',
  maxLength: 'is too long',
  min: 'is too low',
  max: 'is too high',
  validate: 'is not valid',
}

const FormMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, name, formMessageId } = useFormField()

    const body = error ? String(error.message) || `${name} ${defaultErrorMessages[error.type]}` : children

    if (!body) {
      return null
    }

    return (
      <p
        ref={ref}
        id={formMessageId}
        className={cn('text-[0.8rem] font-medium text-destructive', className)}
        {...props}
      >
        {body}
      </p>
    )
  }
)
FormMessage.displayName = 'FormMessage'

const FormSubmit = React.forwardRef<React.ElementRef<typeof Submit>, React.ComponentPropsWithoutRef<typeof Submit>>(
  ({ children, className, ...props }, ref) => {
    return (
      <Submit ref={ref} className={cn(buttonVariants(), 'w-full', className)} {...props}>
        {children}
      </Submit>
    )
  }
)
FormSubmit.displayName = 'FormSubmit'

export {
  Form,
  FormField,
  ControlledFormField,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription,
  FormMessage,
  FormSubmit,
}
