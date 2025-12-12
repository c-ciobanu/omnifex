import { useAppForm } from "@/hooks/form";
import * as z from "zod";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { FieldGroup } from "./ui/field";

const formSchema = z.object({
  name: z.string().trim().min(1),
  featuredOnDashboard: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  defaultValues?: FormValues;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
}

export function ShoppingListModal({ defaultValues, onClose, onSubmit }: Props) {
  const form = useAppForm({
    defaultValues: defaultValues ?? {
      name: "",
      featuredOnDashboard: false,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      const data = formSchema.parse(value);

      onSubmit(data);
    },
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Edit" : "New"} Shopping List</DialogTitle>
        </DialogHeader>

        <form
          id="shopping-list-form"
          onSubmit={async (e) => {
            e.preventDefault();

            await form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField name="name" children={(field) => <field.InputField label="Name" />} />

            <form.AppField
              name="featuredOnDashboard"
              children={(field) => (
                <field.SwitchField
                  label="Featured On Dashboard"
                  description="Only one shopping list can be featured on the dashboard"
                />
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose>Close</DialogClose>

          <form.AppForm>
            <form.SubmitButton form="shopping-list-form">Save</form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
