import { PropsWithChildren } from 'react'

import { cva } from 'class-variance-authority'

import { FieldError, Label, RegisterOptions, Controller } from '@redwoodjs/forms'

import { Input, InputProps } from 'src/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'
import { cn } from 'src/lib/utils'

interface FormFieldProps extends PropsWithChildren {
  className?: string
  label?: string
  name: string
}

const labelVariants = cva('text-sm font-medium leading-none')

const FormField = ({ className, label, name, children }: FormFieldProps) => {
  return (
    <fieldset className={cn('space-y-2', className)}>
      {label ? (
        <Label name={name} className={labelVariants()} errorClassName={cn(labelVariants(), 'text-destructive')}>
          {label}
        </Label>
      ) : null}

      {children}

      <FieldError name={name} className="block text-sm font-medium text-destructive" />
    </fieldset>
  )
}
FormField.displayName = 'FormField'

interface FormInputProps extends InputProps {
  validation?: RegisterOptions
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>((props, ref) => {
  const { name, defaultValue, validation, ...propsRest } = props

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      rules={validation}
      render={({ field }) => <Input id={name} {...propsRest} {...field} ref={ref} />}
    />
  )
})
FormInput.displayName = 'FormInput'

interface FormSelectProps extends React.ComponentPropsWithoutRef<typeof SelectTrigger> {
  validation?: RegisterOptions
  placeholder?: string
  options: { value: string; label: string }[]
}

const FormSelect = React.forwardRef<React.ElementRef<typeof SelectTrigger>, FormSelectProps>((props, ref) => {
  const { name, defaultValue, validation, placeholder, options, ...propsRest } = props

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      rules={validation}
      render={({ field }) => (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger id={name} {...propsRest} ref={ref}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  )
})
FormSelect.displayName = 'FormSelect'

export { FormField, FormInput, FormSelect }
