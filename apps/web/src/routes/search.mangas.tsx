import { Spinner } from "@/components/ui/spinner";
import { useAppForm } from "@/hooks/form";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import * as z from "zod";

export const Route = createFileRoute("/search/mangas")({
  validateSearch: z.object({
    q: z.string().optional(),
  }),
  component: Component,
});

interface MangasGridProps {
  title: string;
}

function MangasGrid({ title }: MangasGridProps) {
  const { data: mangas, isLoading } = useQuery(orpc.mangas.find.queryOptions({ input: { title } }));

  if (isLoading || !mangas) {
    return <Spinner />;
  }

  return (
    <ul className="grid grid-cols-1 divide-y divide-white sm:grid-cols-2 sm:divide-none lg:grid-cols-3">
      {mangas.map((manga) => {
        return (
          <li key={manga.mangaUpdatesId}>
            <Link
              to="/mangas/$mangaUpdatesId"
              params={{ mangaUpdatesId: manga.mangaUpdatesId }}
              title={manga.title}
              className="grid grid-cols-[128px_1fr] gap-6 py-6 hover:bg-gray-100"
            >
              <img src={manga.coverUrl} alt={`${manga.title} cover`} className="h-44 w-full" />
              <div>
                <p>{manga.title}</p>
                <p className="text-gray-500">{manga.releaseYear}</p>
                <p className="line-clamp-3 text-sm text-gray-500 sm:line-clamp-4">{manga.description}</p>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

const formSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character"),
});

function Component() {
  const router = useRouter();
  const search = Route.useSearch();

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

      {search.q ? <MangasGrid title={search.q} /> : null}
    </>
  );
}
