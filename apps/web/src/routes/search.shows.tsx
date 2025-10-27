import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/search/shows")({
  component: Component,
});

function Component() {
  return (
    <div>
      <p>/search/shows</p>
    </div>
  );
}
