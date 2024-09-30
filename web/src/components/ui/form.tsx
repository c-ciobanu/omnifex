import { PropsWithChildren } from 'react'

import { cva } from 'class-variance-authority'

import { FieldError, Label, RegisterOptions, Controller } from '@redwoodjs/forms'

import { Checkbox } from 'src/components/ui/checkbox'
import { Input, InputProps } from 'src/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'src/components/ui/select'
import { cn } from 'src/lib/utils'

interface FormFieldProps extends PropsWithChildren {
  className?: string
  label?: string
  description?: string
  name: string
}

const labelVariants = cva('text-sm font-medium leading-none')

const FormField = ({ className, label, description, name, children }: FormFieldProps) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label ? (
        <Label name={name} className={labelVariants()} errorClassName={cn(labelVariants(), 'text-destructive')}>
          {label}
        </Label>
      ) : null}

      {children}

      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}

      <FieldError name={name} className="block text-sm font-medium text-destructive" />
    </div>
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

interface FormCheckboxProps extends Omit<React.ComponentPropsWithoutRef<typeof Checkbox>, 'defaultValue'> {
  validation?: RegisterOptions
  defaultValue?: boolean
  label: string
}

const FormCheckbox = React.forwardRef<React.ElementRef<typeof Checkbox>, FormCheckboxProps>((props, ref) => {
  const { name, defaultValue, validation, label, ...propsRest } = props

  return (
    <Controller
      name={name}
      defaultValue={defaultValue}
      rules={validation}
      render={({ field }) => (
        <div className="flex items-center gap-2">
          <Checkbox checked={field.value} onCheckedChange={field.onChange} id={name} {...propsRest} ref={ref} />
          <label
            htmlFor={name}
            className={cn(labelVariants(), 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70')}
          >
            {label}
          </label>
        </div>
      )}
    />
  )
})
FormCheckbox.displayName = 'FormCheckbox'

export { FormField, FormInput, FormSelect, FormCheckbox }
