import type { OrpcClientOutputs } from "@/utils/orpc";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { getTime, intlFormat, intlFormatDistance, isAfter, isBefore } from "date-fns";
import { maxTime } from "date-fns/constants";

import { Spinner } from "./ui/spinner";

interface ShowsGridProps {
  shows: OrpcClientOutputs["shows"]["getWatchlist"];
  showAirDate: boolean;
  showLastEpisode: boolean;
}

type ShowWithNextUserEpisodeAirDate = Omit<OrpcClientOutputs["shows"]["getWatchlist"][number], "nextUserEpisode"> & {
  nextUserEpisode: Omit<OrpcClientOutputs["shows"]["getWatchlist"][number]["nextUserEpisode"], "airDate"> & {
    airDate: NonNullable<OrpcClientOutputs["shows"]["getWatchlist"][number]["nextUserEpisode"]["airDate"]>;
  };
};

function ShowsGrid({ shows, showAirDate, showLastEpisode }: ShowsGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
      {shows.map((show) => (
        <li key={show.id}>
          <Link
            to="/shows/$tmdbId"
            params={{ tmdbId: String(show.tmdbId) }}
            title={show.title}
            className="group relative"
          >
            <img
              src={show.nextUserEpisode.season.posterUrl ?? show.posterUrl}
              alt={`${show.title} season ${show.nextUserEpisode.season.number} poster`}
              className="h-full w-full"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute top-2 left-2 text-sm text-white">
                <p>{show.title}</p>

                <p>
                  Next: {show.nextUserEpisode.season.number.toString().padStart(2, "0")}x
                  {show.nextUserEpisode.number.toString().padStart(2, "0")}
                </p>

                {showLastEpisode ? (
                  <>
                    <p>
                      Last: {show.lastEpisode.season.number.toString().padStart(2, "0")}x
                      {show.lastEpisode.number.toString().padStart(2, "0")}
                    </p>

                    {show.lastEpisode.airDate ? (
                      <>
                        <p className="capitalize">{intlFormatDistance(show.lastEpisode.airDate, new Date())}</p>

                        <p className="capitalize">{intlFormat(show.lastEpisode.airDate)}</p>
                      </>
                    ) : null}
                  </>
                ) : null}

                {showAirDate && show.nextUserEpisode.airDate ? (
                  <>
                    <p className="capitalize">{intlFormatDistance(show.nextUserEpisode.airDate, new Date())}</p>
                    <p className="capitalize">{intlFormat(show.nextUserEpisode.airDate)}</p>
                  </>
                ) : null}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ShowsWatchlist() {
  const { data: shows, isLoading } = useQuery(orpc.shows.getWatchlist.queryOptions());

  if (isLoading || !shows) {
    return <Spinner />;
  }

  const now = new Date();

  const onAirShows = shows
    .filter(
      (show): show is ShowWithNextUserEpisodeAirDate =>
        show.nextUserEpisode.airDate !== null && isBefore(show.nextUserEpisode.airDate, now),
    )
    .sort((a, b) => getTime(b.nextUserEpisode.airDate) - getTime(a.nextUserEpisode.airDate));
  const upcomingShows = shows
    .filter((show) => !show.nextUserEpisode.airDate || isAfter(show.nextUserEpisode.airDate, now))
    .sort((a, b) => {
      const aTime = a.nextUserEpisode.airDate ? getTime(a.nextUserEpisode.airDate) : maxTime;
      const bTime = b.nextUserEpisode.airDate ? getTime(b.nextUserEpisode.airDate) : maxTime;

      return aTime - bTime;
    });

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">On Air</h2>
      <ShowsGrid shows={onAirShows} showAirDate={false} showLastEpisode />

      {upcomingShows.length > 0 ? (
        <>
          <h2 className="text-3xl font-bold">Upcoming</h2>
          <ShowsGrid shows={upcomingShows} showAirDate showLastEpisode={false} />
        </>
      ) : null}
    </div>
  );
}
