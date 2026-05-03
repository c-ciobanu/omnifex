import { LexicalEditor } from "@/components/lexical-editor";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Spinner } from "@omnifex/ui/components/ui/spinner";

export const Route = createFileRoute("/documents_/$id")({
  component: Component,
});

function Component() {
  const { id } = Route.useParams();

  const { data: document, isLoading } = useQuery(orpc.documents.get.queryOptions({ input: { id } }));

  if (isLoading || !document) {
    return <Spinner />;
  }

  return (
    <>
      <h2 className="mb-4 text-lg font-semibold md:text-2xl">{document.title}</h2>

      <LexicalEditor document={document} />
    </>
  );
}
