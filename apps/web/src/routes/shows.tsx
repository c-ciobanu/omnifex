import { AbandonedShows } from "@/components/abandoned-shows";
import { ShowsWatchlist } from "@/components/shows-watchlist";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WatchedShows } from "@/components/watched-shows";
import { useAppForm } from "@/hooks/form";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import * as z from "zod";

export const Route = createFileRoute("/shows")({
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
      await router.navigate({ to: "/search/shows", search: { q: value.title } });
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
          children={(field) => <field.InputField inputProps={{ type: "search", placeholder: "Search for a show" }} />}
        />
      </form>

      <Tabs defaultValue="watchlist">
        <TabsList>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="abandoned">Abandoned</TabsTrigger>
          <TabsTrigger value="watched">Watched</TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist">
          <ShowsWatchlist />
        </TabsContent>
        <TabsContent value="abandoned">
          <AbandonedShows />
        </TabsContent>
        <TabsContent value="watched">
          <WatchedShows />
        </TabsContent>
      </Tabs>
    </>
  );
}
