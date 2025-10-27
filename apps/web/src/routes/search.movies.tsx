import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/search/movies")({
  component: Component,
});

function Component() {
  return (
    <div>
      <p>/search/movies</p>
    </div>
  );
}
