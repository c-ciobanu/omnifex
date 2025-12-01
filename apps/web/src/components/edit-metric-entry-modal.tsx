import type { OrpcClientOutputs } from "@/utils/orpc";
import { useAppForm } from "@/hooks/form";
import { zodTypes } from "@/lib/zod";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { FieldGroup } from "./ui/field";

const formSchema = z.object({
  value: zodTypes.number,
  date: z.iso.date(),
});

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  metric: NonNullable<OrpcClientOutputs["metrics"]["get"]>;
  metricEntry: NonNullable<OrpcClientOutputs["metrics"]["get"]>["entries"][number];
}

export function EditMetricEntryModal({ isOpen, setIsOpen, metric, metricEntry }: Props) {
  const updateMetricEntryMutation = useMutation(
    orpc.metrics.updateEntry.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.metrics.get.queryOptions({ input: { id: metric.id } }));

        setIsOpen(false);
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      value: metricEntry.value,
      date: metricEntry.date.toISOString().slice(0, 10),
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const data = formSchema.parse(value);

      await updateMetricEntryMutation.mutateAsync({ id: metricEntry.id, metricId: metric.id, ...data });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Metric Entry</DialogTitle>
        </DialogHeader>

        <form
          id="update-metric-form"
          onSubmit={async (e) => {
            e.preventDefault();

            await form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField
              name="value"
              children={(field) => (
                <field.InputField label={`Value [ ${metric.unit} ]`} inputProps={{ type: "number", step: "any" }} />
              )}
            />

            <form.AppField
              name="date"
              children={(field) => (
                <field.InputField
                  label="Date"
                  inputProps={{ type: "date", max: new Date().toISOString().substring(0, 10) }}
                />
              )}
            />
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
