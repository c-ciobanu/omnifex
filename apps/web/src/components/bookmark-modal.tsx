import { useAppForm } from "@/hooks/form";
import { nullableString } from "@/lib/zod";
import * as z from "zod";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { FieldGroup } from "./ui/field";

const formSchema = z.object({
  name: z.string().trim().min(1),
  url: z.url(),
  iconUrl: nullableString,
});

type FormValues = z.infer<typeof formSchema>;

interface Props {
  defaultValues?: FormValues;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
}

export function BookmarkModal({ defaultValues, onClose, onSubmit }: Props) {
  const form = useAppForm({
    defaultValues: defaultValues ?? {
      name: "",
      url: "",
      iconUrl: "",
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
          <DialogTitle>{defaultValues ? "Edit" : "New"} Bookmark</DialogTitle>
        </DialogHeader>

        <form
          id="bookmark-form"
          onSubmit={async (e) => {
            e.preventDefault();

            await form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField name="name" children={(field) => <field.InputField label="Name" />} />

            <form.AppField
              name="url"
              children={(field) => (
                <field.InputField label="Url" inputProps={{ type: "url", placeholder: "https://example.com" }} />
              )}
            />

            <form.AppField
              name="iconUrl"
              children={(field) => (
                <field.InputField
                  label="Icon Url"
                  inputProps={{ type: "url", placeholder: "https://example.com/icon.png" }}
                />
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose>Close</DialogClose>

          <form.AppForm>
            <form.SubmitButton form="bookmark-form">Save</form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
