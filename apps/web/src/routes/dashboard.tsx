import { Bookmarks } from "@/components/bookmarks";
import { DashboardShoppingList } from "@/components/dashboard-shopping-list";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: Component,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

function Component() {
  return (
    <div className="space-y-4">
      <DashboardShoppingList />
      <Bookmarks />
    </div>
  );
}
