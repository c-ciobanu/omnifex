import { MovieActions } from "@/components/movie-actions";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { StarIcon } from "lucide-react";

export const Route = createFileRoute("/movies_/$tmdbId")({
  component: Component,
});

const formatMinutesToHoursAndMinutes = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return `${h}h ${m}m`;
};

function Component() {
  const { tmdbId } = Route.useParams();

  const { data: session } = authClient.useSession();

  const { data: movie, isLoading } = useQuery(orpc.movies.get.queryOptions({ input: { tmdbId: Number(tmdbId) } }));

  if (isLoading || !movie) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
      <div>
        <h2 className="text-2xl font-bold">{movie.title}</h2>

        {movie.tagline ? <q>{movie.tagline}</q> : null}

        {movie.originalTitle !== movie.title ? <p>Original title: {movie.originalTitle}</p> : null}

        <p>Director: {movie.director}</p>

        <h4 className="flex items-center text-gray-400">
          {movie.releaseDate.getFullYear()}
          {" · "}
          {formatMinutesToHoursAndMinutes(movie.runtime)}
          {" · "}
          <StarIcon className="mx-1 h-5 w-5 fill-yellow-300 text-yellow-300" />
          <span className="font-medium text-gray-900">{movie.rating.toString()}</span>/10
        </h4>

        <div className="mt-6 flex items-start gap-6">
          <img src={movie.posterUrl} alt={`${movie.title} poster`} className="w-1/4" />

          <div className="space-y-3">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="nline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset"
                >
                  {genre}
                </span>
              ))}
            </div>
            <p className="prose max-w-none">{movie.overview}</p>
          </div>
        </div>
      </div>

      {session ? (
        <div className="lg:w-72 lg:shrink-0">
          <MovieActions movie={movie} />
        </div>
      ) : null}
    </div>
  );
}
