import type { OrpcClientOutputs } from "@/utils/orpc";
import { useAppForm } from "@/hooks/form";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { FieldGroup } from "./ui/field";

const formSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character"),
  isPublic: z.boolean(),
});

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  document: OrpcClientOutputs["documents"]["getAll"][number];
}

export function EditDocumentModal({ isOpen, setIsOpen, document }: Props) {
  const updateDocumentMutation = useMutation(
    orpc.documents.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.documents.getAll.queryOptions());

        setIsOpen(false);
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      title: document.title,
      isPublic: document.isPublic,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const data = formSchema.parse(value);

      await updateDocumentMutation.mutateAsync({ id: document.id, ...data });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
        </DialogHeader>

        <form
          id="update-document-form"
          onSubmit={async (e) => {
            e.preventDefault();

            await form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField name="title" children={(field) => <field.InputField label="Title" />} />

            <form.AppField
              name="isPublic"
              children={(field) => (
                <field.SwitchField
                  label="Public Access"
                  description="Anyone on the Internet with the link will be able to view it."
                />
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose>Close</DialogClose>

          <form.AppForm>
            <form.SubmitButton form="update-document-form">Save</form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
