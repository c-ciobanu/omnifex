import type { OrpcClientOutputs } from "@/utils/orpc";
import { useAppForm } from "@/hooks/form";
import { zodTypes } from "@/lib/zod";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { FieldGroup } from "./ui/field";

const formSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"),
  unit: zodTypes.optionalString,
});

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  metric: OrpcClientOutputs["metrics"]["getAll"][number];
}

export function EditMetricModal({ isOpen, setIsOpen, metric }: Props) {
  const updateMetricMutation = useMutation(
    orpc.metrics.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.metrics.getAll.queryOptions());

        setIsOpen(false);
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      name: metric.name,
      unit: metric.unit,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const data = formSchema.parse(value);

      await updateMetricMutation.mutateAsync({ id: metric.id, ...data });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Metric</DialogTitle>
        </DialogHeader>

        <form
          id="update-metric-form"
          onSubmit={async (e) => {
            e.preventDefault();

            await form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField name="name" children={(field) => <field.InputField label="Name" />} />

            <form.AppField name="unit" children={(field) => <field.InputField label="Unit" />} />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose>Close</DialogClose>

          <form.AppForm>
            <form.SubmitButton form="update-metric-form">Save</form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
