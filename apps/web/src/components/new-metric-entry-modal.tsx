import type { OrpcClientOutputs } from "@/utils/orpc";
import { useAppForm } from "@/hooks/form";
import { orpc } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import * as z from "zod";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { FieldGroup } from "./ui/field";

const formSchema = z.object({
  value: z.coerce.number<number>(),
  date: z.iso.date(),
});

interface Props {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  metric: OrpcClientOutputs["metrics"]["getAll"][number] | NonNullable<OrpcClientOutputs["metrics"]["get"]>;
  onCompleted: () => Promise<void>;
}

export function NewMetricEntryModal({ isOpen, setIsOpen, metric, onCompleted }: Props) {
  const createMetricEntryMutation = useMutation(
    orpc.metrics.createEntry.mutationOptions({
      onSuccess: async () => {
        await onCompleted();

        setIsOpen(false);
      },
    }),
  );

  const latestEntryValue =
    "latestEntry" in metric
      ? metric.latestEntry.value
      : "entries" in metric && metric.entries[0]
        ? metric.entries[0].value
        : 0;

  const form = useAppForm({
    defaultValues: {
      value: latestEntryValue,
      date: new Date().toISOString().substring(0, 10),
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const data = formSchema.parse(value);

      await createMetricEntryMutation.mutateAsync({ metricId: metric.id, ...data });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Metric Entry</DialogTitle>
        </DialogHeader>

        <form
          id="create-metric-entry-form"
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
            <form.SubmitButton form="create-metric-entry-form">Save</form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
