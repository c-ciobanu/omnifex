import { InputField } from "@/components/ui/form/input";
import { SelectField } from "@/components/ui/form/select";
import { SubmitButton } from "@/components/ui/form/submit-button";
import { SwitchField } from "@/components/ui/form/switch";
import { TextareaField } from "@/components/ui/form/textarea";
import { createFormHook } from "@tanstack/react-form";

import { fieldContext, formContext } from "./form-context";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { InputField, SelectField, SwitchField, TextareaField },
  formComponents: { SubmitButton },
});
