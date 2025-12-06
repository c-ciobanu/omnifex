import { useFieldContext } from "@/hooks/form-context";

import { Field, FieldDescription, FieldError, FieldLabel } from "../field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";

interface Props {
  label?: string;
  description?: string;
  options: { value: string; label: string }[];
}

export function SelectField({ label, description, options }: Props) {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const id = `form-tanstack-select-${field.name}`;

  return (
    <Field orientation="responsive" data-invalid={isInvalid}>
      {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}

      <Select name={field.name} value={field.state.value} onValueChange={field.handleChange}>
        <SelectTrigger id={id} aria-invalid={isInvalid} className="min-w-[120px]">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>

        <SelectContent position="item-aligned">
          {options.map((option) => (
            <SelectItem value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {description ? <FieldDescription>{description}</FieldDescription> : null}

      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
    </Field>
  );
}
