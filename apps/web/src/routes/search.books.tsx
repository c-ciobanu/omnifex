import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/search/books")({
  component: Component,
});

function Component() {
  return (
    <div>
      <p>/search/books</p>
    </div>
  );
}
