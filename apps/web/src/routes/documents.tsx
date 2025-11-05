import { useReducer } from "react";
import { EditDocumentModal } from "@/components/edit-document-modal";
import { NewDocument } from "@/components/new-document";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { MoreVerticalIcon } from "lucide-react";

export const Route = createFileRoute("/documents")({
  component: Component,
  beforeLoad: async ({ location }) => {
    const { data: session } = await authClient.getSession();

    if (!session) {
      return redirect({ to: "/login", search: { redirect: location.href } });
    }

    return { session };
  },
});

const initialState = { isOpen: false, documentIndex: -1 };

type Action = { type: "setIsOpen"; nextIsOpen: boolean } | { type: "open"; nextDocumentIndex: number };

function reducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case "setIsOpen": {
      return {
        documentIndex: action.nextIsOpen ? state.documentIndex : initialState.documentIndex,
        isOpen: action.nextIsOpen,
      };
    }
    case "open": {
      return {
        documentIndex: action.nextDocumentIndex,
        isOpen: true,
      };
    }
  }
}

function Component() {
  const [deleteState, deleteDispatch] = useReducer(reducer, initialState);
  const [editState, editDispatch] = useReducer(reducer, initialState);

  const { data: documents, isLoading } = useQuery(orpc.documents.getAll.queryOptions());

  const deleteDocumentMutation = useMutation(
    orpc.documents.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.documents.getAll.queryOptions());

        deleteDispatch({ type: "setIsOpen", nextIsOpen: false });
      },
    }),
  );

  if (isLoading || !documents) {
    return <Spinner />;
  }

  const documentToUpdate = documents[editState.documentIndex];
  const documentToDelete = documents[deleteState.documentIndex];

  return (
    <>
      <div className="mb-4 flex justify-end">
        <NewDocument />
      </div>

      <ul className="divide-y divide-white">
        {documents.map((document, index) => (
          <li key={document.id} className="flex items-center justify-between gap-6 py-4">
            <p className="text-sm font-medium">{document.title}</p>

            <div className="flex shrink-0 items-center gap-4">
              <Button asChild variant="outline">
                <Link to="/documents/$id" params={{ id: String(document.id) }} title={document.title}>
                  View Document
                </Link>
              </Button>

              <DropdownMenu>
                <Button asChild variant="ghost" size="icon">
                  <DropdownMenuTrigger>
                    <MoreVerticalIcon className="h-4 w-4" />
                  </DropdownMenuTrigger>
                </Button>

                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => editDispatch({ type: "open", nextDocumentIndex: index })}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteDispatch({ type: "open", nextDocumentIndex: index })}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>

      {documentToUpdate ? (
        <EditDocumentModal
          isOpen={editState.isOpen}
          setIsOpen={(open: boolean) => editDispatch({ type: "setIsOpen", nextIsOpen: open })}
          document={documentToUpdate}
        />
      ) : null}

      {documentToDelete ? (
        <AlertDialog
          open={deleteState.isOpen}
          onOpenChange={(open) => deleteDispatch({ type: "setIsOpen", nextIsOpen: open })}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Document?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the document &#34;{documentToDelete.title}&#34;?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => deleteDocumentMutation.mutate({ id: documentToDelete.id })}
                disabled={deleteDocumentMutation.isPending}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </>
  );
}
