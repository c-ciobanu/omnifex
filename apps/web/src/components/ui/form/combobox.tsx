import { useState } from "react";
import { useFieldContext } from "@/hooks/form-context";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { Button } from "../button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../command";
import { Field, FieldDescription, FieldError, FieldLabel } from "../field";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

interface Props {
  label?: string;
  description?: string;
  options: { value: string; label: string }[];
}

export function ComboboxField({ label, description, options }: Props) {
  const [open, setOpen] = useState(false);

  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const id = `form-tanstack-combobox-${field.name}`;

  return (
    <Field orientation="responsive" data-invalid={isInvalid}>
      {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between font-normal"
          >
            {field.state.value ? (
              options.find((option) => option.value === field.state.value)?.label
            ) : (
              <span className="text-muted-foreground">Select an option</span>
            )}
            <ChevronsUpDownIcon className="opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
          <Command>
            <CommandInput placeholder="Search option..." />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(currentValue) => {
                      field.handleChange(currentValue === field.state.value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    {option.label}
                    <CheckIcon
                      className={cn("ml-auto", field.state.value === option.value ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {description ? <FieldDescription>{description}</FieldDescription> : null}

      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
    </Field>
  );
}
