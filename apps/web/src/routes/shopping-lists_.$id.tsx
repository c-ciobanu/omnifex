import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/shopping-lists_/$id")({
  component: Component,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

function Component() {
  const { id } = Route.useParams();

  return id;
}
