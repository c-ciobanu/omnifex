import type { OrpcClientOutputs } from "@/utils/orpc";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BookOpenIcon, CircleCheckBigIcon } from "lucide-react";

import { Spinner } from "./ui/spinner";

interface MangasGridProps {
  mangas: OrpcClientOutputs["mangas"]["getReading"];
}

function MangasGrid({ mangas }: MangasGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
      {mangas.map((manga) => {
        const lastChapterRead = manga.userProgress.lastChapterRead ?? 0;

        const chaptersLeftToRead = manga.chapters - lastChapterRead;

        return (
          <li key={manga.id}>
            <Link
              to="/mangas/$mangaDexId"
              params={{ mangaDexId: manga.mangaDexId }}
              title={manga.title}
              className="group relative"
            >
              <img src={manga.coverUrl} alt={`${manga.title} cover`} className="h-full w-full" />

              <div className="absolute top-2 right-2 flex items-center gap-1.5 rounded-sm bg-black/50 px-1.5 py-0.5 text-sm text-white backdrop-blur-sm">
                <BookOpenIcon className="size-4" />
                {chaptersLeftToRead}
              </div>

              {manga.status === "ENDED" ? (
                <CircleCheckBigIcon className="absolute right-2 bottom-2 size-5 text-green-500" />
              ) : null}

              <div className="absolute inset-0 bg-linear-to-t from-black/70 to-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute top-2 left-2 text-sm text-white">
                  <p>{manga.title}</p>

                  <p>Next: {lastChapterRead + 1}</p>

                  <p>Last: {manga.chapters}</p>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function MangasReadingList() {
  const { data: mangas, isLoading } = useQuery(orpc.mangas.getReading.queryOptions());

  if (isLoading || !mangas) {
    return <Spinner />;
  }

  const readingMangas = mangas.filter((e) => e.userProgress.lastChapterRead !== null);
  const toReadMangas = mangas.filter((e) => e.userProgress.lastChapterRead === null);

  return (
    <div className="space-y-4">
      {readingMangas.length > 0 ? (
        <>
          <h2 className="text-3xl font-bold">Reading</h2>
          <MangasGrid mangas={readingMangas} />
        </>
      ) : null}

      {toReadMangas.length > 0 ? (
        <>
          <h2 className="text-3xl font-bold">To Read</h2>
          <MangasGrid mangas={toReadMangas} />
        </>
      ) : null}
    </div>
  );
}
