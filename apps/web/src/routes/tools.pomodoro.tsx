import { useState } from "react";
import { PomodoroTimer } from "@/components/pomodoro-timer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/form";
import { zodTypes } from "@/lib/zod";
import { createFileRoute } from "@tanstack/react-router";
import { PlayIcon } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import * as z from "zod";

export const Route = createFileRoute("/tools/pomodoro")({
  component: Component,
});

const formSchema = z.object({
  pomodoro: zodTypes.number,
  shortBreak: zodTypes.number,
  longBreak: zodTypes.number,
});

type FormValues = z.infer<typeof formSchema>;

function Component() {
  const [settings, setSettings] = useLocalStorage<FormValues>("pomodoroSettings", {
    pomodoro: 50,
    shortBreak: 10,
    longBreak: 30,
  });
  const [showTimer, setShowTimer] = useState(false);

  const form = useAppForm({
    defaultValues: settings,
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const data = formSchema.parse(value);

      if (Notification.permission !== "granted") {
        await Notification.requestPermission();
      }

      setSettings(data);
      setShowTimer(true);
    },
  });

  return (
    <div className="min-h-main flex flex-col items-center justify-center">
      {showTimer ? (
        <PomodoroTimer settings={settings} />
      ) : (
        <Card className="min-w-2xl">
          <CardHeader>
            <CardTitle>Pomodoro Settings</CardTitle>
          </CardHeader>

          <CardContent>
            <form
              id="pomodoro-settings-form"
              onSubmit={async (e) => {
                e.preventDefault();

                await form.handleSubmit();
              }}
            >
              <FieldGroup>
                <form.AppField
                  name="pomodoro"
                  children={(field) => <field.InputField label="Pomodoro" inputProps={{ type: "number" }} />}
                />

                <form.AppField
                  name="shortBreak"
                  children={(field) => <field.InputField label="Short break" inputProps={{ type: "number" }} />}
                />

                <form.AppField
                  name="longBreak"
                  children={(field) => <field.InputField label="Long break" inputProps={{ type: "number" }} />}
                />
              </FieldGroup>
            </form>
          </CardContent>

          <CardFooter>
            <form.AppForm>
              <form.SubmitButton form="pomodoro-settings-form" className="w-full">
                <PlayIcon /> Start
              </form.SubmitButton>
            </form.AppForm>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
