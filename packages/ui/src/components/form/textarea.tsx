import { Field, FieldDescription, FieldError, FieldLabel } from "@omnifex/ui/components/ui/field";
import { Textarea } from "@omnifex/ui/components/ui/textarea";
import { useFieldContext } from "@omnifex/ui/hooks/form-context";

interface Props {
  label?: string;
  description?: string;
  textareaProps?: React.ComponentProps<typeof Textarea>;
}

export function TextareaField({ label, description, textareaProps = {} }: Props) {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const id = `form-tanstack-textarea-${field.name}`;

  return (
    <Field data-invalid={isInvalid}>
      {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}

      <Textarea
        {...textareaProps}
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
