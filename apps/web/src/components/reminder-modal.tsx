import type { OrpcClientBodyInputs, OrpcClientOutputs } from "@/utils/orpc";
import { zodTypes } from "@/lib/zod";
import { addMinutes, format } from "date-fns";
import * as z from "zod";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@omnifex/ui/components/ui/dialog";
import { FieldGroup } from "@omnifex/ui/components/ui/field";
import { useAppForm } from "@omnifex/ui/hooks/form";

const formSchema = z.object({
  title: zodTypes.requiredString,
  notes: zodTypes.nullableString,
  date: z.iso.date(),
  time: z.iso.time(),
});

type Reminder = OrpcClientOutputs["reminders"]["getAll"][number];

interface Props {
  defaultValues?: Reminder;
  onClose: () => void;
  onSubmit: (data: OrpcClientBodyInputs["reminders"]["create"]) => void;
}

export function ReminderModal({ defaultValues, onClose, onSubmit }: Props) {
  const now = new Date();

  const form = useAppForm({
    defaultValues: defaultValues
      ? {
          title: defaultValues.title,
          notes: defaultValues.notes,
          date: defaultValues.date.toISOString().substring(0, 10),
          time: format(defaultValues.date, "HH:mm"),
        }
      : {
          title: "",
          notes: "",
          date: now.toISOString().substring(0, 10),
          time: format(addMinutes(now, 1), "HH:mm"),
        },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      const data = formSchema.parse(value);

      onSubmit({
        title: data.title,
        notes: data.notes,
        date: new Date(`${data.date}T${data.time}`).toISOString(),
      });
    },
  });

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues ? "Edit" : "New"} Reminder</DialogTitle>
        </DialogHeader>

        <form
          id="reminder-form"
          onSubmit={async (e) => {
            e.preventDefault();

            await form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.AppField name="title" children={(field) => <field.InputField label="Title" />} />

            <form.AppField name="notes" children={(field) => <field.TextareaField label="Notes" />} />

            <form.AppField
              name="date"
              children={(field) => (
                <field.InputField label="Date" inputProps={{ type: "date", min: now.toISOString().substring(0, 10) }} />
              )}
            />

            <form.AppField
              name="time"
              children={(field) => <field.InputField label="Time" inputProps={{ type: "time" }} />}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose>Close</DialogClose>

          <form.AppForm>
            <form.SubmitButton form="reminder-form">Save</form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
