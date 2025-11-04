import type { OrpcClientOutputs } from "@/utils/orpc";
import { cn } from "@/lib/utils";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon, EyeOffIcon, ListMinusIcon, ListPlusIcon } from "lucide-react";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Progress } from "./ui/progress";

interface ShowActionsProps {
  id: number;
  tmdbId: number;
  episodesNumber: number;
  userProgress: NonNullable<OrpcClientOutputs["shows"]["get"]["userProgress"]>;
}

export function ShowActions({ id, tmdbId, episodesNumber, userProgress }: ShowActionsProps) {
  const { watched, watchedEpisodes, watchedPercentage, inWatchlist, abandoned } = userProgress;

  function onSuccess() {
    void queryClient.invalidateQueries(orpc.shows.get.queryOptions({ input: { tmdbId: Number(tmdbId) } }));
  }

  const watchMutation = useMutation(orpc.shows.watch.mutationOptions({ onSuccess }));
  const unwatchMutation = useMutation(orpc.shows.unwatch.mutationOptions({ onSuccess }));
  const watchlistMutation = useMutation(orpc.shows.watchlist.mutationOptions({ onSuccess }));
  const unwatchlistMutation = useMutation(orpc.shows.unwatchlist.mutationOptions({ onSuccess }));
  const abandonMutation = useMutation(orpc.shows.abandon.mutationOptions({ onSuccess }));
  const unabandonMutation = useMutation(orpc.shows.unabandon.mutationOptions({ onSuccess }));

  const toggleToWatchStatus = () => {
    if (inWatchlist) {
      unwatchlistMutation.mutate({ id });
    } else {
      watchlistMutation.mutate({ id });
    }
  };

  const toggleAbandonedStatus = () => {
    if (abandoned) {
      unabandonMutation.mutate({ id });
    } else {
      abandonMutation.mutate({ id });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {watchedEpisodes === 0 ? (
        <Button
          onClick={() => watchMutation.mutate({ id })}
          disabled={watchMutation.isPending}
          variant="outline"
          size="lg"
          className="h-12 justify-start gap-4 border-teal-500 px-2 text-base text-teal-500 uppercase hover:bg-teal-500 hover:text-white"
        >
          <EyeOffIcon />
          <span>Set as watched</span>
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
                  <p className="text-sm uppercase">{watchedPercentage}% Watched</p>
                  <p className="text-xs">
                    {watchedEpisodes}/{episodesNumber} episodes
                  </p>
                </div>
              </Button>

              <Progress value={watchedPercentage} className="rounded-none bg-teal-600/40 *:bg-teal-400" />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="dropdown-menu-content">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {!watched ? (
              <DropdownMenuItem onClick={() => watchMutation.mutate({ id })}>Watch remaining episodes</DropdownMenuItem>
            ) : null}
            <DropdownMenuItem onClick={() => unwatchMutation.mutate({ id })} className="text-destructive">
              Unwatch all episodes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {watched || watchedEpisodes > 0 || abandoned ? null : (
        <Button
          onClick={toggleToWatchStatus}
          disabled={watchlistMutation.isPending || unwatchMutation.isPending}
          variant="outline"
          size="lg"
          className={cn(
            "h-12 justify-start gap-4 border-sky-500 px-2 text-base uppercase",
            inWatchlist
              ? "bg-sky-500 text-white hover:border-sky-600 hover:bg-sky-600 hover:text-white"
              : "text-sky-500 hover:bg-sky-500 hover:text-white",
          )}
        >
          {inWatchlist ? <ListPlusIcon /> : <ListMinusIcon />}
          <span>{inWatchlist ? "Listed on watchlist" : "Add to watchlist"}</span>
        </Button>
      )}

      {watched || inWatchlist ? null : (
        <Button
          onClick={toggleAbandonedStatus}
          disabled={abandonMutation.isPending || unabandonMutation.isPending}
          variant="outline"
          size="lg"
          className={cn(
            "h-12 justify-start gap-4 border-indigo-500 px-2 text-base uppercase",
            abandoned
              ? "bg-indigo-500 text-white hover:border-indigo-600 hover:bg-indigo-600 hover:text-white"
              : "text-indigo-500 hover:bg-indigo-500 hover:text-white",
          )}
        >
          {abandoned ? <ListPlusIcon /> : <ListMinusIcon />}
          <span>{abandoned ? "Abandoned" : "Set as abandoned"}</span>
        </Button>
      )}
    </div>
  );
}
