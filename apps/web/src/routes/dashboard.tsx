import { Bookmarks } from "@/components/bookmarks";
import { authClient } from "@/lib/auth-client";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: Component,
  beforeLoad: async ({ location }) => {
    const { data: session } = await authClient.getSession();

    if (!session) {
      return redirect({ to: "/login", search: { redirect: location.href } });
    }

    return { session };
  },
});

function Component() {
  return <Bookmarks />;
}
