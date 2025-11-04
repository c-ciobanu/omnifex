import placeholderTallUrl from "@/assets/placeholder-tall.svg";
import placeholderWideUrl from "@/assets/placeholder-wide.svg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarIcon, CheckIcon, CircleCheckIcon, Clock3Icon, EyeOffIcon, StarIcon } from "lucide-react";

export const Route = createFileRoute("/shows_/$tmdbId_/seasons/$number")({
  component: Component,
});

function Component() {
  const { tmdbId, number } = Route.useParams();

  const { data: season, isLoading } = useQuery(
    orpc.shows.getSeason.queryOptions({ input: { showTmdbId: Number(tmdbId), seasonNumber: Number(number) } }),
  );

  function onSuccess() {
    void queryClient.invalidateQueries(
      orpc.shows.getSeason.queryOptions({ input: { showTmdbId: Number(tmdbId), seasonNumber: Number(number) } }),
    );
  }

  const watchSeasonMutation = useMutation(orpc.shows.watchSeason.mutationOptions({ onSuccess }));
  const unwatchSeasonMutation = useMutation(orpc.shows.unwatchSeason.mutationOptions({ onSuccess }));
  const watchEpisodeMutation = useMutation(orpc.shows.watchEpisode.mutationOptions({ onSuccess }));
  const unwatchEpisodeMutation = useMutation(orpc.shows.unwatchEpisode.mutationOptions({ onSuccess }));

  if (isLoading || !season) {
    return <Spinner />;
  }

  const { show, watchedEpisodes, userProgress } = season;

  function isWatchedEpisode(episodeId: number) {
    return watchedEpisodes.some((e) => e.episodeId === episodeId);
  }

  function toggleWatchEpisode(episodeId: number) {
    if (isWatchedEpisode(episodeId)) {
      unwatchEpisodeMutation.mutate({ id: episodeId });
    } else {
      watchEpisodeMutation.mutate({ id: episodeId });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex w-full items-start gap-6">
          <img
            src={season.posterUrl ?? placeholderTallUrl}
            alt={`${show.title} season ${season.number} poster`}
            className="w-1/4"
          />

          <div className="space-y-3">
            <h1 className="text-2xl font-bold">{show.title}</h1>
            <h2 className="text-2xl font-semibold">Season {season.number}</h2>

            <p className="flex items-center">
              <StarIcon className="mr-1 h-5 w-5 fill-yellow-300 text-yellow-300" />
              <span className="font-medium text-gray-900">{season.rating.toString()}</span>/10
              {" · "}
              <CalendarIcon className="mx-1 h-5 w-5" />
              {season.airDate?.toLocaleDateString()}
            </p>

            <p className="prose max-w-none">{season.overview}</p>
          </div>
        </div>

        {userProgress ? (
          <div className="lg:w-72 lg:shrink-0">
            {season.watchedEpisodes.length === 0 ? (
              <Button
                onClick={() => watchSeasonMutation.mutate({ id: season.id })}
                disabled={watchSeasonMutation.isPending}
                variant="outline"
                size="lg"
                className="h-12 w-full justify-start gap-4 border-teal-500 px-2 text-base text-teal-500 uppercase hover:bg-teal-500 hover:text-white"
              >
                <EyeOffIcon />
                <span>Watch all the episodes</span>
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div>
                    <Button
                      size="lg"
                      className="h-12 w-full justify-start gap-4 rounded-none bg-teal-500 px-2 text-white hover:bg-teal-500/80"
                    >
                      <CheckIcon className="!h-6 !w-6" />

                      <div className="text-left">
                        <p className="text-sm uppercase">{userProgress.watchedPercentage}% Watched</p>
                        <p className="text-xs">
                          {userProgress.watchedEpisodes}/{season.episodes.length} episodes
                        </p>
                      </div>
                    </Button>

                    <Progress
                      value={userProgress.watchedPercentage}
                      className="rounded-none bg-teal-600/40 *:bg-teal-400"
                    />
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="dropdown-menu-content">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {!userProgress.watched ? (
                    <DropdownMenuItem onClick={() => watchSeasonMutation.mutate({ id: season.id })}>
                      Watch remaining episodes
                    </DropdownMenuItem>
                  ) : null}
                  <DropdownMenuItem
                    onClick={() => unwatchSeasonMutation.mutate({ id: season.id })}
                    className="text-destructive"
                  >
                    Unwatch all episodes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ) : null}
      </div>

      <h3 className="text-2xl font-semibold">Episodes</h3>

      {season.episodes.map((episode) => (
        <Card key={episode.id} className="w-full max-w-full">
          <CardContent className="flex flex-col gap-4 md:flex-row">
            <img
              src={episode.stillUrl ?? placeholderWideUrl}
              alt={`${episode.title} still`}
              className="rounded-md md:w-1/4"
            />

            <div className="space-y-2 md:w-3/4">
              <div className="flex justify-between">
                <h4 className="text-lg font-semibold">
                  {episode.number.toString().padStart(2, "0")}. {episode.title}
                </h4>

                {userProgress ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={isWatchedEpisode(episode.id) ? "text-green-500" : "text-black"}
                    onClick={() => toggleWatchEpisode(episode.id)}
                  >
                    <CircleCheckIcon className="!h-6 !w-6" />
                  </Button>
                ) : null}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  {episode.airDate?.toLocaleDateString()}
                </span>

                <span className="flex items-center gap-1">
                  <Clock3Icon className="h-4 w-4" />
                  {episode.runtime} min
                </span>

                <span className="flex items-center gap-1">
                  <StarIcon className="h-4 w-4 fill-yellow-300 text-yellow-300" />
                  {episode.rating.toString()}
                </span>
              </div>

              <p className="prose max-w-none">{episode.overview}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
