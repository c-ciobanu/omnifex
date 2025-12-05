import { BooksReadingList } from "@/components/books-reading-list";
import { ReadBooks } from "@/components/read-books";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppForm } from "@/hooks/form";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import * as z from "zod";

export const Route = createFileRoute("/books")({
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
      await router.navigate({ to: "/search/books", search: { q: value.title } });
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
          children={(field) => <field.InputField inputProps={{ type: "search", placeholder: "Search for a book" }} />}
        />
      </form>

      <Tabs defaultValue="readingList">
        <TabsList>
          <TabsTrigger value="readingList">Reading List</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
        </TabsList>

        <TabsContent value="readingList">
          <BooksReadingList />
        </TabsContent>
        <TabsContent value="read">
          <ReadBooks />
        </TabsContent>
      </Tabs>
    </>
  );
}
