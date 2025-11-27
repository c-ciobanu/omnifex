import type { OrpcClientOutputs } from "@/utils/orpc";
import { useState } from "react";
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
import { Spinner } from "@/components/ui/spinner";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ExternalLinkIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { BookmarkModal } from "./bookmark-modal";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function getUrlHostname(url: string) {
  return new URL(url).hostname;
}

type Bookmark = OrpcClientOutputs["bookmarks"]["getAll"][number];

export function Bookmarks() {
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [bookmarkToUpdate, setBookmarkToUpdate] = useState<Bookmark>();
  const [bookmarkToDelete, setBookmarkToDelete] = useState<Bookmark>();

  const { data: bookmarks, isLoading } = useQuery(orpc.bookmarks.getAll.queryOptions());

  const createBookmarkMutation = useMutation(
    orpc.bookmarks.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.bookmarks.getAll.queryOptions());

        setShowBookmarkModal(false);
      },
    }),
  );

  const updateBookmarkMutation = useMutation(
    orpc.bookmarks.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.bookmarks.getAll.queryOptions());

        setShowBookmarkModal(false);
        setBookmarkToUpdate(undefined);
      },
    }),
  );

  const deleteBookmarkMutation = useMutation(
    orpc.bookmarks.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.bookmarks.getAll.queryOptions());

        setBookmarkToDelete(undefined);
      },
    }),
  );

  if (isLoading || !bookmarks) {
    return <Spinner />;
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl font-bold">Bookmarks</h2>

        <Button onClick={() => setShowBookmarkModal(true)}>
          <PlusIcon />
          New Bookmark
        </Button>
      </div>

      {bookmarks.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {bookmarks.map((bookmark) => (
            <li
              key={bookmark.id}
              className="bg-background/70 flex justify-between rounded-2xl border p-4 shadow-sm backdrop-blur"
            >
              <div className="flex gap-4">
                <Avatar className="ring-primary size-12 ring">
                  <AvatarImage
                    src={bookmark.iconUrl ?? `https://icons.duckduckgo.com/ip3/${getUrlHostname(bookmark.url)}.ico`}
                  />
                  <AvatarFallback>{bookmark.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-semibold">{bookmark.name}</p>

                  <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary flex items-center gap-2 text-sm font-medium hover:underline"
                  >
                    {getUrlHostname(bookmark.url)}
                    <ExternalLinkIcon className="size-4" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setShowBookmarkModal(true);
                    setBookmarkToUpdate(bookmark);
                  }}
                >
                  <PencilIcon aria-hidden="true" />
                  <span className="sr-only">Edit {bookmark.name}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => {
                    setBookmarkToDelete(bookmark);
                  }}
                >
                  <Trash2Icon aria-hidden="true" />
                  <span className="sr-only">Delete {bookmark.name}</span>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {showBookmarkModal ? (
        <BookmarkModal
          defaultValues={bookmarkToUpdate}
          onClose={() => {
            setShowBookmarkModal(false);
            setBookmarkToUpdate(undefined);
          }}
          onSubmit={(data) => {
            if (bookmarkToUpdate) {
              updateBookmarkMutation.mutate({ ...data, id: bookmarkToUpdate.id });
            } else {
              createBookmarkMutation.mutate(data);
            }
          }}
        />
      ) : null}

      {bookmarkToDelete ? (
        <AlertDialog open={true} onOpenChange={() => setBookmarkToDelete(undefined)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete bookmark?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the bookmark &#34;{bookmarkToDelete.name}&#34;?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => deleteBookmarkMutation.mutate({ id: bookmarkToDelete.id })}
                disabled={deleteBookmarkMutation.isPending}
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
