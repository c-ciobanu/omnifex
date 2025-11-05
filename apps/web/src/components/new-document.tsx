import { useState } from "react";
import { useAppForm } from "@/hooks/form";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import * as z from "zod";

import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { FieldGroup } from "./ui/field";

const formSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character"),
});

export function NewDocument() {
  const [isOpen, setIsOpen] = useState(false);

  const createDocumentMutation = useMutation(
    orpc.documents.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.documents.getAll.queryOptions());

        setIsOpen(false);
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      title: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const data = formSchema.parse(value);

      await createDocumentMutation.mutateAsync(data);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          New Document
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Document</DialogTitle>
        </DialogHeader>

        <form
          id="create-document-form"
          onSubmit={async (e) => {
            e.preventDefault();

            await form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField name="title" children={(field) => <field.InputField label="Title" />} />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose>Close</DialogClose>

          <form.AppForm>
            <form.SubmitButton form="create-document-form">Save</form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
