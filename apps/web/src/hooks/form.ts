import { InputField } from "@/components/ui/form/input";
import { SubmitButton } from "@/components/ui/form/submit-button";
import { createFormHook } from "@tanstack/react-form";

import { fieldContext, formContext } from "./form-context";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { InputField },
  formComponents: { SubmitButton },
});
