import { zodTypes } from "@/lib/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import * as z from "zod";

import { Button } from "@omnifex/ui/components/ui/button";
import { FieldGroup } from "@omnifex/ui/components/ui/field";
import { useAppForm } from "@omnifex/ui/hooks/form";

const formSchema = z.object({
  name: zodTypes.requiredString,
  instructions: z.array(zodTypes.requiredString).min(1),
  ingredients: z
    .array(
      z.object({
        name: zodTypes.requiredString,
        quantity: zodTypes.requiredString,
        unit: zodTypes.nullableString,
      }),
    )
    .min(1),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  onSubmit: (data: FormValues) => Promise<void>;
  defaultValues?: FormValues;
}

export function RecipeForm({ onSubmit, defaultValues }: Props) {
  const form = useAppForm({
    defaultValues: defaultValues ?? {
      name: "",
      instructions: [""],
      ingredients: [{ name: "", quantity: "", unit: "" }],
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const data = formSchema.parse(value);

      await onSubmit(data);
    },
  });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        await form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.AppField name="name" children={(field) => <field.InputField label="Name" />} />

        <form.Field name="instructions" mode="array">
          {(field) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Instructions</h3>

                <Button type="button" variant="outline" onClick={() => field.pushValue("")}>
                  <PlusIcon />
                  Add Step
                </Button>
              </div>

              <div className="space-y-2">
                {field.state.value.map((_, index) => (
                  <div key={`instruction-${index}`} className="space-y-2 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Step {index + 1}</p>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => field.removeValue(index)}
                        disabled={field.state.value.length === 1}
                      >
                        <Trash2Icon />
                        <span className="sr-only">Remove step {index + 1}</span>
                      </Button>
                    </div>

                    <form.AppField
                      name={`instructions[${index}]`}
                      children={(subField) => <subField.TextareaField textareaProps={{ rows: 2 }} />}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </form.Field>

        <form.Field name="ingredients" mode="array">
          {(field) => (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Ingredients</h3>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => field.pushValue({ name: "", quantity: "", unit: "" })}
                >
                  <PlusIcon />
                  Add Ingredient
                </Button>
              </div>

              <div className="space-y-2">
                {field.state.value.map((_, index) => (
                  <div key={`ingredient-${index}`} className="rounded-lg border p-4">
                    <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_auto]">
                      <form.AppField
                        name={`ingredients[${index}].name`}
                        children={(subField) => <subField.InputField inputProps={{ placeholder: "Name" }} />}
                      />

                      <form.AppField
                        name={`ingredients[${index}].quantity`}
                        children={(subField) => <subField.InputField inputProps={{ placeholder: "Quantity" }} />}
                      />

                      <form.AppField
                        name={`ingredients[${index}].unit`}
                        children={(subField) => <subField.InputField inputProps={{ placeholder: "Unit" }} />}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => field.removeValue(index)}
                        disabled={field.state.value.length === 1}
                      >
                        <Trash2Icon />
                        <span className="sr-only">Remove ingredient {index + 1}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form.Field>

        <form.AppForm>
          <form.SubmitButton>Save</form.SubmitButton>
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
