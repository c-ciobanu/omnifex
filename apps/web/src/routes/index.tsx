import logoUrl from "@/assets/logo.svg";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Component,
});

function Component() {
  return (
    <div className="min-h-main flex flex-col items-center justify-center">
      <p>Popcorn is ready!</p>
      <p>Want to watch a movie or maybe read a book?</p>
      <p>It&#39;s up to you.</p>
      <img src={logoUrl} alt="Popcorn" title="Happy Popcorn!" />
    </div>
  );
}
