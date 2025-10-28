import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
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

  const form = useForm({
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
              <form.Field
                name="username"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="username"
                        autoFocus
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <Input
                        id={field.name}
                        type="password"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="new-password"
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <Button type="submit" form="sign-up-form">
            Sign up
          </Button>
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
