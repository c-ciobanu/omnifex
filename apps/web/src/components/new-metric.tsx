import { useState } from "react";
import { useAppForm } from "@/hooks/form";
import { zodTypes } from "@/lib/zod";
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
  name: z.string().min(1, "Name must be at least 1 character"),
  unit: zodTypes.optionalString,
  entry: z.object({
    value: zodTypes.number,
    date: z.iso.date(),
  }),
});

export function NewMetric() {
  const [isOpen, setIsOpen] = useState(false);

  const createMetricMutation = useMutation(
    orpc.metrics.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.metrics.getAll.queryOptions());

        setIsOpen(false);
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
      unit: "",
      entry: {
        value: 0,
        date: new Date().toISOString().substring(0, 10),
      },
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const data = formSchema.parse(value);

      await createMetricMutation.mutateAsync(data);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon /> New Metric
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Metric</DialogTitle>
        </DialogHeader>

        <form
          id="create-metric-form"
          onSubmit={async (e) => {
            e.preventDefault();

            await form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField name="name" children={(field) => <field.InputField label="Name" />} />

            <form.AppField name="unit" children={(field) => <field.InputField label="Unit" />} />

            <form.AppField
              name="entry.value"
              children={(field) => (
                <field.InputField label="Entry Value" inputProps={{ type: "number", step: "any" }} />
              )}
            />

            <form.AppField
              name="entry.date"
              children={(field) => (
                <field.InputField
                  label="Entry Date"
                  inputProps={{ type: "date", max: new Date().toISOString().substring(0, 10) }}
                />
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose>Close</DialogClose>

          <form.AppForm>
            <form.SubmitButton form="create-metric-form">Save</form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
