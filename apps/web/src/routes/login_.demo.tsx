import { useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login_/demo")({
  component: Component,
});

function Component() {
  const router = useRouter();

  async function signIn() {
    const { error } = await authClient.signIn.username({ username: "demo", password: "demo" });

    if (error) {
      toast.error(error.message);
      return;
    }

    await router.invalidate();
    await router.navigate({ to: "/dashboard" });
  }

  useEffect(() => {
    void signIn();
  }, []);

  return (
    <div className="min-h-main flex flex-col items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-center">
            <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
              <Loader2Icon className="text-primary h-8 w-8 animate-spin" />
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center">
          <p>Please wait while we sign you into the demo account</p>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-muted-foreground text-xs">This will only take a moment...</p>
        </CardFooter>
      </Card>
    </div>
  );
}
