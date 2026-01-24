import { AbandonedMangas } from "@/components/abandoned-mangas";
import { MangasReadingList } from "@/components/mangas-reading-list";
import { ReadMangas } from "@/components/read-mangas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppForm } from "@/hooks/form";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import * as z from "zod";

export const Route = createFileRoute("/mangas")({
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
      await router.navigate({ to: "/search/mangas", search: { q: value.title } });
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
          children={(field) => <field.InputField inputProps={{ type: "search", placeholder: "Search for a manga" }} />}
        />
      </form>

      <Tabs defaultValue="reading">
        <TabsList>
          <TabsTrigger value="reading">Reading</TabsTrigger>
          <TabsTrigger value="abandoned">Abandoned</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>

        <TabsContent value="reading">
          <MangasReadingList />
        </TabsContent>
        <TabsContent value="abandoned">
          <AbandonedMangas />
        </TabsContent>
        <TabsContent value="read">
          <ReadMangas />
        </TabsContent>
      </Tabs>
    </>
  );
}
