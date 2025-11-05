import { useFieldContext } from "@/hooks/form-context";

import { Field, FieldDescription, FieldError, FieldLabel } from "../field";
import { Input } from "../input";

interface Props {
  label?: string;
  description?: string;
  inputProps?: React.ComponentProps<typeof Input>;
}

export function InputField({ label, description, inputProps = {} }: Props) {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const id = `form-tanstack-input-${field.name}`;

  return (
    <Field data-invalid={isInvalid}>
      {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}

      <Input
        {...inputProps}
        id={id}
        name={field.name}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        aria-invalid={isInvalid}
      />

      {description ? <FieldDescription>{description}</FieldDescription> : null}

      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
    </Field>
  );
}
