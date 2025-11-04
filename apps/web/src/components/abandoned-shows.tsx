import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { Spinner } from "./ui/spinner";

export function AbandonedShows() {
  const { data: shows, isLoading } = useQuery(orpc.shows.getAbandoned.queryOptions());

  if (isLoading || !shows) {
    return <Spinner />;
  }

  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
      {shows.map((show) => (
        <li key={show.id}>
          <Link to="/shows/$tmdbId" params={{ tmdbId: String(show.tmdbId) }} title={show.title}>
            <img src={show.posterUrl} alt={`${show.title} poster`} className="h-full w-full" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
