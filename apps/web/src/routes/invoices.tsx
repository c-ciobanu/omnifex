import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/invoices")({
  component: Component,
});

function Component() {
  return (
    <div>
      <p>/invoices</p>
    </div>
  );
}
