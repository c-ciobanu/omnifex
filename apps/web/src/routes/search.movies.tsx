import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/utils/orpc";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import * as z from "zod";

export const Route = createFileRoute("/search/movies")({
  validateSearch: z.object({
    q: z.string().optional(),
  }),
  component: Component,
});

interface MoviesGridProps {
  title: string;
}

function MoviesGrid({ title }: MoviesGridProps) {
  const { data, isLoading } = useQuery(orpc.movies.find.queryOptions({ input: { title } }));

  if (isLoading || !data) {
    return <Spinner />;
  }

  return (
    <ul className="grid grid-cols-1 divide-y divide-white sm:grid-cols-2 sm:divide-none lg:grid-cols-3">
      {data.map((movie) => {
        return (
          <li key={movie.tmdbId}>
            <Link
              to="/movies/$tmdbId"
              params={{ tmdbId: String(movie.tmdbId) }}
              title={movie.title}
              className="grid grid-cols-[128px_1fr] gap-6 py-6 hover:bg-gray-100"
            >
              <img src={movie.posterUrl} alt={`${movie.title} poster`} className="h-44 w-full" />
              <div>
                <p>{movie.title}</p>
                <p className="text-gray-500">{movie.releaseYear}</p>
                <p className="line-clamp-3 text-sm text-gray-500 sm:line-clamp-4">{movie.overview}</p>
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

  const form = useForm({
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
        <form.Field
          name="title"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <Input
                  id={field.name}
                  type="search"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Search for a movie"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        />
      </form>

      {search.q ? <MoviesGrid title={search.q} /> : null}
    </>
  );
}
