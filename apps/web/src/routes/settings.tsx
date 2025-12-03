import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/form";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";

export const Route = createFileRoute("/settings")({
  component: Component,
  beforeLoad: async ({ location }) => {
    const { data: session } = await authClient.getSession();

    if (!session) {
      return redirect({ to: "/login", search: { redirect: location.href } });
    }

    return { session };
  },
});

const formSchema = z.object({
  currentPassword: z.string().min(8, "Current password must be at least 8 characters"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

function Component() {
  const form = useAppForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const data = formSchema.parse(value);

      const { error } = await authClient.changePassword(data);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Your password has been updated");
      form.reset();
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">Settings</h2>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>You will be logged out of all your other sessions</CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="change-password-form"
            onSubmit={async (event) => {
              event.preventDefault();

              await form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField
                name="currentPassword"
                children={(field) => (
                  <field.InputField
                    label="Current password"
                    inputProps={{ type: "password", autoComplete: "current-password" }}
                  />
                )}
              />

              <form.AppField
                name="newPassword"
                children={(field) => (
                  <field.InputField
                    label="New password"
                    inputProps={{ type: "password", autoComplete: "new-password" }}
                  />
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <form.AppForm>
            <form.SubmitButton form="change-password-form">Save</form.SubmitButton>
          </form.AppForm>
        </CardFooter>
      </Card>
    </div>
  );
}
