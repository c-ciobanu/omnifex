import { Check, ChevronsUpDown } from 'lucide-react'

import { RedwoodRegisterOptions } from '@redwoodjs/forms'

import {
  ControlledFormField,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'src/components/form'
import { Button } from 'src/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'src/components/ui/command'
import { Input } from 'src/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from 'src/components/ui/popover'
import { Switch } from 'src/components/ui/switch'
import { Textarea } from 'src/components/ui/textarea'
import { cn } from 'src/lib/utils'

interface FormInputProps extends React.ComponentProps<typeof Input> {
  validation?: RedwoodRegisterOptions
  label?: string
  description?: string
}

const FormInput = (props: FormInputProps) => {
  const { name, className, label, description, validation, ...inputProps } = props

  return (
    <FormField
      name={name}
      validation={validation}
      render={(register) => (
        <FormItem className={className}>
          {label ? <FormLabel>{label}</FormLabel> : null}

          <FormControl>
            <Input {...inputProps} {...register} />
          </FormControl>

          {description ? <FormDescription>{description}</FormDescription> : null}

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface FormTextareaProps extends React.ComponentProps<typeof Textarea> {
  validation?: RedwoodRegisterOptions
  label?: string
  description?: string
}

const FormTextarea = (props: FormTextareaProps) => {
  const { name, className, label, description, validation, ...textareaProps } = props

  return (
    <FormField
      name={name}
      validation={validation}
      render={(register) => (
        <FormItem className={className}>
          {label ? <FormLabel>{label}</FormLabel> : null}

          <FormControl>
            <Textarea {...textareaProps} {...register} />
          </FormControl>

          {description ? <FormDescription>{description}</FormDescription> : null}

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface FormComboboxProps {
  name: string
  validation?: RedwoodRegisterOptions
  label?: string
  description?: string
  options: { value: string | number; label: string }[]
}

const FormCombobox = (props: FormComboboxProps) => {
  const { name, label, description, options, validation } = props
  const [open, setOpen] = React.useState(false)

  return (
    <ControlledFormField
      name={name}
      rules={validation}
      render={({ field }) => (
        <FormItem className="w-full">
          {label ? <FormLabel>{label}</FormLabel> : null}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn('w-full justify-between', !field.value && 'text-muted-foreground')}
                >
                  {field.value ? options.find((option) => option.value === field.value)?.label : 'Select an option'}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent className="popover-content p-0">
              <Command>
                <CommandInput placeholder="Search option..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        value={option.label}
                        key={option.value}
                        onSelect={() => {
                          field.onChange(option.value)
                          setOpen(false)
                        }}
                      >
                        {option.label}
                        <Check className={cn('ml-auto', option.value === field.value ? 'opacity-100' : 'opacity-0')} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {description ? <FormDescription>{description}</FormDescription> : null}

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface FormSwitchProps extends React.ComponentProps<typeof Switch> {
  name: string
  validation?: RedwoodRegisterOptions
  label: string
  description?: string
}

const FormSwitch = (props: FormSwitchProps) => {
  const { name, label, description, validation, ...switchProps } = props

  return (
    <ControlledFormField
      name={name}
      rules={validation}
      render={({ field }) => (
        <FormItem>
          <div className="flex flex-row items-center justify-between gap-2">
            <FormLabel>{label}</FormLabel>

            <FormControl>
              <Switch {...switchProps} checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </div>

          {description ? <FormDescription>{description}</FormDescription> : null}

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { FormCombobox, FormInput, FormTextarea, FormSwitch }
