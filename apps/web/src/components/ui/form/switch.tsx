import { useFieldContext } from "@/hooks/form-context";

import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "../field";
import { Switch } from "../switch";

interface Props {
  label: string;
  description?: string;
  switchProps?: React.ComponentProps<typeof Switch>;
}

export function SwitchField({ label, description, switchProps = {} }: Props) {
  const field = useFieldContext<boolean>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const id = `form-tanstack-switch-${field.name}`;

  return (
    <Field orientation="horizontal" data-invalid={isInvalid}>
      <FieldContent>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>

        {description ? <FieldDescription>{description}</FieldDescription> : null}

        {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
      </FieldContent>

      <Switch
        {...switchProps}
        id={id}
        name={field.name}
        checked={field.state.value}
        onCheckedChange={field.handleChange}
        aria-invalid={isInvalid}
      />
    </Field>
  );
}
