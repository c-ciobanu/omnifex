import type * as React from "react";
import { useFieldContext } from "@/hooks/form-context";
import { cn } from "@/lib/utils";

import { Field, FieldDescription, FieldError, FieldLabel } from "../field";
import { Input } from "../input";

interface Props {
  label?: string;
  description?: string;
  inputProps?: React.ComponentProps<typeof Input>;
  className?: string;
}

export function FileInputField({ label, description, inputProps = {}, className }: Props) {
  const field = useFieldContext<File | undefined>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
  const id = `form-tanstack-file-input-${field.name}`;

  return (
    <Field data-invalid={isInvalid} className={className}>
      {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}

      <Input
        {...inputProps}
        type="file"
        id={id}
        name={field.name}
        onBlur={field.handleBlur}
        value={field.state.value ? `C:\\fakepath\\${field.state.value.name}` : ""}
        onChange={(e) => field.handleChange(e.target.files?.[0])}
        aria-invalid={isInvalid}
        className={cn(
          "text-muted-foreground file:border-input file:text-foreground p-0 pr-4 italic file:mr-4 file:h-full file:border-0 file:border-r file:border-solid file:bg-transparent file:px-4 file:text-sm file:font-medium file:not-italic",
          inputProps.className,
        )}
      />

      {description ? <FieldDescription>{description}</FieldDescription> : null}

      {isInvalid ? <FieldError errors={field.state.meta.errors} /> : null}
    </Field>
  );
}
