import placeholderTallUrl from "@/assets/placeholder-tall.svg";
import { Spinner } from "@/components/ui/spinner";
import { useAppForm } from "@/hooks/form";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import * as z from "zod";

export const Route = createFileRoute("/search/shows")({
  validateSearch: z.object({
    q: z.string().optional(),
  }),
  component: Component,
});

interface ShowsGridProps {
  title: string;
}

function ShowsGrid({ title }: ShowsGridProps) {
  const { data: shows, isLoading } = useQuery(orpc.shows.find.queryOptions({ input: { title } }));

  if (isLoading || !shows) {
    return <Spinner />;
  }

  return (
    <ul className="grid grid-cols-1 divide-y divide-white sm:grid-cols-2 sm:divide-none lg:grid-cols-3">
      {shows.map((show) => {
        return (
          <li key={show.tmdbId}>
            <Link
              to="/shows/$tmdbId"
              params={{ tmdbId: String(show.tmdbId) }}
              title={show.title}
              className="grid grid-cols-[128px_1fr] gap-6 py-6 hover:bg-gray-100"
            >
              <img src={show.posterUrl ?? placeholderTallUrl} alt={`${show.title} poster`} className="h-44 w-full" />
              <div>
                <p>{show.title}</p>
                <p className="text-gray-500">{show.releaseYear}</p>
                <p className="line-clamp-3 text-sm text-gray-500 sm:line-clamp-4">{show.overview}</p>
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

      {search.q ? <ShowsGrid title={search.q} /> : null}
    </>
  );
}
