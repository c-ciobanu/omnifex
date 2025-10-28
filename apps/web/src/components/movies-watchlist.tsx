import type { OrpcClientOutputs } from "@/utils/orpc";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getTime, intlFormat, intlFormatDistance, isAfter, isBefore } from "date-fns";

import { Spinner } from "./ui/spinner";

interface MoviesGridProps {
  movies: OrpcClientOutputs["movies"]["getWatchlist"];
}

function MoviesGrid({ movies }: MoviesGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
      {movies.map((movie) => (
        <li key={movie.id}>
          <Link
            to="/movies/$tmdbId"
            params={{ tmdbId: String(movie.tmdbId) }}
            title={movie.title}
            className="group relative"
          >
            <img src={movie.posterUrl} alt={`${movie.title} poster`} className="h-full w-full" />

            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute top-2 left-2 text-sm text-white">
                <p>{movie.title}</p>
                <p className="capitalize">{intlFormatDistance(movie.releaseDate, new Date())}</p>
                <p className="capitalize">{intlFormat(movie.releaseDate)}</p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function MoviesWatchlist() {
  const { data, isLoading } = useQuery(orpc.movies.getWatchlist.queryOptions());

  if (isLoading || !data) {
    return <Spinner />;
  }

  const now = new Date();

  const onAirMovies = data
    .filter((movie) => isBefore(movie.releaseDate, now))
    .sort((a, b) => getTime(b.releaseDate) - getTime(a.releaseDate));
  const upcomingMovies = data
    .filter((movie) => isAfter(movie.releaseDate, now))
    .sort((a, b) => getTime(a.releaseDate) - getTime(b.releaseDate));

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">On Air</h2>
      <MoviesGrid movies={onAirMovies} />

      {upcomingMovies.length > 0 ? (
        <>
          <h2 className="text-3xl font-bold">Upcoming</h2>
          <MoviesGrid movies={upcomingMovies} />
        </>
      ) : null}
    </div>
  );
}
