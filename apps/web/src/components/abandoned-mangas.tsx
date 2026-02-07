import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { Spinner } from "./ui/spinner";

export function AbandonedMangas() {
  const { data: mangas, isLoading } = useQuery(orpc.mangas.getAbandoned.queryOptions());

  if (isLoading || !mangas) {
    return <Spinner />;
  }

  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
      {mangas.map((manga) => (
        <li key={manga.id}>
          <Link to="/mangas/$mangaUpdatesId" params={{ mangaUpdatesId: manga.mangaUpdatesId }} title={manga.title}>
            <img src={manga.coverUrl} alt={`${manga.title} cover`} className="h-full w-full" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
