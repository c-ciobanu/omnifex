import { createFormHook } from "@tanstack/react-form";

import { ComboboxField } from "@omnifex/ui/components/form/combobox";
import { FileInputField } from "@omnifex/ui/components/form/file-input";
import { InputField } from "@omnifex/ui/components/form/input";
import { SelectField } from "@omnifex/ui/components/form/select";
import { SubmitButton } from "@omnifex/ui/components/form/submit-button";
import { SwitchField } from "@omnifex/ui/components/form/switch";
import { TextareaField } from "@omnifex/ui/components/form/textarea";

import { fieldContext, formContext } from "./form-context";

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: { InputField, FileInputField, SelectField, SwitchField, TextareaField, ComboboxField },
  formComponents: { SubmitButton },
});
