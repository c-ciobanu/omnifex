import { BookActions } from "@/components/book-actions";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/books_/$googleId")({
  component: Component,
});

function Component() {
  const { googleId } = Route.useParams();

  const { data: session } = authClient.useSession();

  const { data: book, isLoading } = useQuery(orpc.books.get.queryOptions({ input: { googleId } }));

  if (isLoading || !book) {
    return <Spinner />;
  }

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
      <div>
        <h2 className="text-2xl font-bold">
          {book.title}
          {book.subtitle ? `: ${book.subtitle}` : undefined}
        </h2>
        <div>By {book.authors.join(", ")}</div>
        <h4 className="text-gray-400">
          {book.publicationDate.getFullYear()} · {book.pages} pages
        </h4>

        <div className="mt-6 flex items-start gap-6">
          <img src={book.coverUrl} alt={`${book.title} cover`} className="w-1/4" />

          <div className="space-y-3">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {book.genres.map((genre) => (
                <span
                  key={genre}
                  className="nline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div dangerouslySetInnerHTML={{ __html: book.description }} className="prose max-w-none" />
          </div>
        </div>
      </div>

      {session ? (
        <div className="lg:w-72 lg:shrink-0">
          <BookActions book={book} />
        </div>
      ) : null}
    </div>
  );
}
