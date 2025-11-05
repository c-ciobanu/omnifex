import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { Spinner } from "./ui/spinner";

export function BooksReadingList() {
  const { data: books, isLoading } = useQuery(orpc.books.getReadingList.queryOptions());

  if (isLoading || !books) {
    return <Spinner />;
  }

  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
      {books.map((book) => (
        <li key={book.id}>
          <Link to="/books/$googleId" params={{ googleId: book.googleId }} title={book.title}>
            <img src={book.coverUrl} alt={`${book.title} cover`} className="h-full w-full" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
