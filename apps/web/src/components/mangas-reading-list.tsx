import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { Spinner } from "./ui/spinner";

export function MangasReadingList() {
  const { data: mangas, isLoading } = useQuery(orpc.mangas.getReading.queryOptions());

  if (isLoading || !mangas) {
    return <Spinner />;
  }

  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
      {mangas.map((manga) => (
        <li key={manga.id}>
          <Link
            to="/mangas/$mangaDexId"
            params={{ mangaDexId: manga.mangaDexId }}
            title={manga.title}
            className="group relative"
          >
            <img src={manga.coverUrl} alt={`${manga.title} cover`} className="h-full w-full" />

            <div className="absolute inset-0 bg-linear-to-t from-black/70 to-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute top-2 left-2 text-sm text-white">
                <p>{manga.title}</p>

                <p>Next: {(manga.userProgress.lastChapterRead ?? 0) + 1}</p>

                <p>Last: {manga.chapters}</p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
