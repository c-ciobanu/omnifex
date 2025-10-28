import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { Spinner } from "./ui/spinner";

export function WatchedMovies() {
  const { data, isLoading } = useQuery(orpc.movies.getWatched.queryOptions());

  if (isLoading || !data) {
    return <Spinner />;
  }

  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
      {data.map((movie) => (
        <li key={movie.id}>
          <Link to="/movies/$tmdbId" params={{ tmdbId: String(movie.tmdbId) }} title={movie.title}>
            <img src={movie.posterUrl} alt={`${movie.title} poster`} className="h-full w-full" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
