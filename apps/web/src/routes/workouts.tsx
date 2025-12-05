import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/workouts")({
  component: Component,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

function Component() {
  return (
    <div>
      <p>/workouts</p>
    </div>
  );
}
