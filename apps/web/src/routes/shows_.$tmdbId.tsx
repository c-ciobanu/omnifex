import placeholderTallUrl from "@/assets/placeholder-tall.svg";
import { ShowActions } from "@/components/show-actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { millisecondsInSecond } from "date-fns/constants";
import { CircleCheckIcon, RefreshCwIcon, StarIcon } from "lucide-react";

export const Route = createFileRoute("/shows_/$tmdbId")({
  component: Component,
});

function Component() {
  const { tmdbId } = Route.useParams();

  const { data: session } = authClient.useSession();

  const { data: show, isLoading } = useQuery(orpc.shows.get.queryOptions({ input: { tmdbId: Number(tmdbId) } }));

  function onSuccess() {
    void queryClient.invalidateQueries(orpc.shows.get.queryOptions({ input: { tmdbId: Number(tmdbId) } }));
  }

  const watchSeasonMutation = useMutation(orpc.shows.watchSeason.mutationOptions({ onSuccess }));
  const unwatchSeasonMutation = useMutation(orpc.shows.unwatchSeason.mutationOptions({ onSuccess }));
  const updateMutation = useMutation(
    orpc.shows.triggerManualUpdate.mutationOptions({
      onSuccess: () => {
        setTimeout(onSuccess, millisecondsInSecond * 5);
      },
    }),
  );

  function toggleWatchSeason(seasonId: number, watched: boolean) {
    if (watched) {
      unwatchSeasonMutation.mutate({ id: seasonId });
    } else {
      watchSeasonMutation.mutate({ id: seasonId });
    }
  }

  if (isLoading || !show) {
    return <Spinner />;
  }

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div>
          {session?.user.role === "admin" ? (
            <div className="flex items-center gap-2">
              <p>Last updated at: {show.updatedAt.toLocaleString()}</p>
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => {
                  updateMutation.mutate({ tmdbId: Number(tmdbId) });
                }}
              >
                <RefreshCwIcon />
              </Button>
            </div>
          ) : null}

          <h2 className="text-2xl font-bold">{show.title}</h2>

          {show.tagline ? <q>{show.tagline}</q> : null}

          {show.originalTitle !== show.title ? <p>Original title: {show.originalTitle}</p> : null}

          <p>Created by: {show.creators.join(", ")}</p>

          <p className="flex items-center text-gray-400">
            <StarIcon className="mx-1 h-5 w-5 fill-yellow-300 text-yellow-300" />
            <span className="font-medium text-gray-900">{show.rating.toString()}</span>/10
          </p>

          <div className="mt-6 flex items-start gap-6">
            <img src={show.posterUrl} alt={`${show.title} poster`} className="w-1/4" />

            <div className="space-y-3">
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {show.genres.map((genre) => (
                  <span
                    key={genre}
                    className="nline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <p className="prose max-w-none">{show.overview}</p>
            </div>
          </div>
        </div>

        {show.userProgress ? (
          <div className="lg:w-72 lg:shrink-0">
            <ShowActions
              id={show.id}
              tmdbId={show.tmdbId}
              episodesNumber={show.episodesNumber}
              userProgress={show.userProgress}
            />
          </div>
        ) : null}
      </div>

      <div className="mt-6 space-y-6">
        <h4 className="text-lg font-semibold">{show.seasons.length} Seasons</h4>

        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {show.seasons.map((season) => (
            <li key={season.id}>
              <Link
                to="/shows/$tmdbId/seasons/$number"
                params={{ tmdbId: String(show.tmdbId), number: String(season.number) }}
                title={`${show.title} season ${season.number}`}
                className="group relative"
              >
                <img
                  src={season.posterUrl ?? placeholderTallUrl}
                  alt={`Season ${season.number} poster`}
                  className="w-full"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="absolute top-2 left-2 font-medium text-white">Season {season.number}</p>
                </div>

                {season.userProgress ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "absolute right-2 bottom-2",
                      season.userProgress.watched ? "text-green-500" : "text-white",
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      if (!season.userProgress) {
                        return;
                      }

                      toggleWatchSeason(season.id, season.userProgress.watched);
                    }}
                  >
                    <CircleCheckIcon className="!h-6 !w-6" />
                  </Button>
                ) : null}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
