import type { OrpcClientOutputs } from "@/utils/orpc";
import { cn } from "@/lib/utils";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, ListMinus, ListPlus } from "lucide-react";

import { Button } from "./ui/button";

interface MovieActionsProps {
  movie: OrpcClientOutputs["movies"]["get"];
}

export function MovieActions({ movie }: MovieActionsProps) {
  const { id, tmdbId, userInfo } = movie;
  const { watched, inWatchlist } = userInfo ?? {};

  function onSuccess() {
    void queryClient.invalidateQueries(orpc.movies.get.queryOptions({ input: { tmdbId: Number(tmdbId) } }));
  }

  const watchMutation = useMutation(orpc.movies.watch.mutationOptions({ onSuccess }));
  const unwatchMutation = useMutation(orpc.movies.unwatch.mutationOptions({ onSuccess }));
  const watchlistMutation = useMutation(orpc.movies.watchlist.mutationOptions({ onSuccess }));
  const unwatchlistMutation = useMutation(orpc.movies.unwatchlist.mutationOptions({ onSuccess }));

  const toggleWatchedStatus = () => {
    if (watched) {
      unwatchMutation.mutate({ id });
    } else {
      watchMutation.mutate({ id });
    }
  };

  const toggleToWatchStatus = () => {
    if (inWatchlist) {
      unwatchlistMutation.mutate({ id });
    } else {
      watchlistMutation.mutate({ id });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={toggleWatchedStatus}
        disabled={watchMutation.isPending || unwatchMutation.isPending}
        variant="outline"
        size="lg"
        className={cn(
          "h-12 justify-start gap-4 border-teal-500 px-2 text-base uppercase",
          watched
            ? "bg-teal-500 text-white hover:border-teal-600 hover:bg-teal-600 hover:text-white"
            : "text-teal-500 hover:bg-teal-500 hover:text-white",
        )}
      >
        {watched ? <Eye /> : <EyeOff />}
        <span>{watched ? "Watched" : "Set as watched"}</span>
      </Button>

      {watched ? null : (
        <Button
          onClick={toggleToWatchStatus}
          disabled={watchlistMutation.isPending || unwatchlistMutation.isPending}
          variant="outline"
          size="lg"
          className={cn(
            "h-12 justify-start gap-4 border-sky-500 px-2 text-base uppercase",
            inWatchlist
              ? "bg-sky-500 text-white hover:border-sky-600 hover:bg-sky-600 hover:text-white"
              : "text-sky-500 hover:bg-sky-500 hover:text-white",
          )}
        >
          {inWatchlist ? <ListPlus /> : <ListMinus />}
          <span>{inWatchlist ? "Listed on watchlist" : "Add to watchlist"}</span>
        </Button>
      )}
    </div>
  );
}
