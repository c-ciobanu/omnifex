import { MoviesWatchlist } from "@/components/movies-watchlist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WatchedMovies } from "@/components/watched-movies";
import { useAppForm } from "@/hooks/form";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import * as z from "zod";

export const Route = createFileRoute("/movies")({
  component: Component,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

const formSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character"),
});

function Component() {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      title: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      await router.navigate({ to: "/search/movies", search: { q: value.title } });
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void form.handleSubmit();
        }}
        className="mb-4"
      >
        <form.AppField
          name="title"
          children={(field) => <field.InputField inputProps={{ type: "search", placeholder: "Search for a movie" }} />}
        />
      </form>

      <Tabs defaultValue="watchlist">
        <TabsList>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="watched">Watched</TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist">
          <MoviesWatchlist />
        </TabsContent>
        <TabsContent value="watched">
          <WatchedMovies />
        </TabsContent>
      </Tabs>
    </>
  );
}
