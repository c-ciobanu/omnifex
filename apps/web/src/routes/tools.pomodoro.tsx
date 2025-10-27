import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/tools/pomodoro")({
  component: Component,
});

function Component() {
  return (
    <div>
      <p>/tools/pomodoro</p>
    </div>
  );
}
