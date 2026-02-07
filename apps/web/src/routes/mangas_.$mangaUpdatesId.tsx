import { MangaActions } from "@/components/manga-actions";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Markdown from "react-markdown";

export const Route = createFileRoute("/mangas_/$mangaUpdatesId")({
  component: Component,
});

function Component() {
  const { mangaUpdatesId } = Route.useParams();

  const { data: session } = authClient.useSession();

  const { data: manga, isLoading } = useQuery(orpc.mangas.get.queryOptions({ input: { mangaUpdatesId } }));

  if (isLoading || !manga) {
    return <Spinner />;
  }

  const authors = [...new Set(manga.authors.concat(manga.artists))];

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
      <div>
        <h2 className="text-2xl font-bold">{manga.title}</h2>

        <div>By {authors.join(", ")}</div>

        <h4 className="text-gray-400">
          {manga.releaseYear} · {manga.chapters} chapters
        </h4>

        <div className="mt-6 flex items-start gap-6">
          <img src={manga.coverUrl} alt={`${manga.title} cover`} className="w-1/4" />

          <div className="space-y-3">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {manga.genres.map((genre) => (
                <span
                  key={genre}
                  className="nline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="prose max-w-none">
              <Markdown>{manga.description}</Markdown>
            </div>
          </div>
        </div>
      </div>

      {session ? (
        <div className="lg:w-72 lg:shrink-0">
          <MangaActions manga={manga} />
        </div>
      ) : null}
    </div>
  );
}
