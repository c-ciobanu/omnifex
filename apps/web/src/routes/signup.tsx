import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { useAppForm } from "@/hooks/form";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import * as z from "zod";

export const Route = createFileRoute("/signup")({
  component: Component,
});

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 5 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function Component() {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          name: "John Doe",
          email: "john.doe@example.com",
          ...value,
        },
        {
          onSuccess: async () => {
            await router.navigate({ to: "/documents" });
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      );
    },
  });

  return (
    <div className="min-h-main flex flex-col items-center justify-center space-y-10">
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            id="sign-up-form"
            onSubmit={async (e) => {
              e.preventDefault();

              await form.handleSubmit();
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
                  <field.InputField label="Password" inputProps={{ type: "password", autoComplete: "new-password" }} />
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <form.AppForm>
            <form.SubmitButton form="sign-up-form" className="w-full">
              Sign up
            </form.SubmitButton>
          </form.AppForm>
        </CardFooter>
      </Card>

      <div>
        <span className="text-sm text-gray-500">Already have an account?</span>{" "}
        <Link to={"/login"} className="text-sm font-semibold text-blue-600 hover:text-blue-500">
          Sign in!
        </Link>
      </div>

      <div>
        <p className="text-sm text-gray-500">Not ready to sign up just yet? No worries!</p>
        <Link to="/login/demo" className="text-sm font-semibold text-blue-600 hover:text-blue-500">
          Try out our demo account!
        </Link>
      </div>
    </div>
  );
}
