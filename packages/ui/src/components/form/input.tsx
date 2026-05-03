import { Field, FieldDescription, FieldError, FieldLabel } from "@omnifex/ui/components/ui/field";
import { Input } from "@omnifex/ui/components/ui/input";
import { useFieldContext } from "@omnifex/ui/hooks/form-context";

interface Props {
  label?: string;
  description?: string;
  inputProps?: React.ComponentProps<typeof Input>;
  className?: string;
}

export function InputField({ label, description, inputProps = {}, className }: Props) {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const id = `form-tanstack-input-${field.name}`;

  return (
    <Field data-invalid={isInvalid} className={className}>
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
