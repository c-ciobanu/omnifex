import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/form";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: Component,
});

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 5 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function Component() {
  const router = useRouter();
  const search = Route.useSearch();

  const form = useAppForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signIn.username(value);

      if (error) {
        toast.error(error.message);
        return;
      }

      await router.invalidate();
      await router.navigate({ to: search.redirect ?? "/dashboard" });
    },
  });

  return (
    <div className="min-h-main flex flex-col items-center justify-center space-y-10">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            id="sign-in-form"
            onSubmit={(e) => {
              e.preventDefault();
              void form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField
                name="username"
                children={(field) => (
                  <field.InputField label="Username" inputProps={{ autoComplete: "username", autoFocus: true }} />
                )}
              />

              <form.AppField
                name="password"
                children={(field) => (
                  <field.InputField
                    label="Password"
                    inputProps={{ type: "password", autoComplete: "current-password" }}
                  />
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <form.AppForm>
            <form.SubmitButton form="sign-in-form" className="w-full">
              Sign in
            </form.SubmitButton>
          </form.AppForm>
        </CardFooter>
      </Card>

      <div>
        <span className="text-sm text-gray-500">Don&apos;t have an account?</span>{" "}
        <Link to="/signup" className="text-sm font-semibold text-blue-600 hover:text-blue-500">
          Sign up!
        </Link>
      </div>
    </div>
  );
}
