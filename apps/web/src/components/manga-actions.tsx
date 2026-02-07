import type { OrpcClientOutputs } from "@/utils/orpc";
import { useState } from "react";
import { useAppForm } from "@/hooks/form";
import { cn } from "@/lib/utils";
import { zodTypes } from "@/lib/zod";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon, EyeOffIcon, ListMinusIcon, ListPlusIcon } from "lucide-react";
import * as z from "zod";

import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Progress } from "./ui/progress";

const formSchema = z.object({
  chapter: zodTypes.number.gte(1),
});

interface ChapterNumberDialogFormProps {
  onOpenChange: (open: boolean) => void;
  manga: OrpcClientOutputs["mangas"]["get"];
  onSubmit: (chapter: number) => void;
}

function ChapterNumberDialogForm({ onOpenChange, manga, onSubmit }: ChapterNumberDialogFormProps) {
  const form = useAppForm({
    defaultValues: {
      chapter: manga.userProgress?.lastChapterRead ?? 1,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      const data = formSchema.parse(value);

      onSubmit(data.chapter);
    },
  });

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Read till chapter</DialogTitle>
        </DialogHeader>

        <form
          id="set-last-chapter-read-form"
          onSubmit={async (e) => {
            e.preventDefault();
            await form.handleSubmit();
          }}
        >
          <form.AppField
            name="chapter"
            children={(field) => (
              <field.InputField label="Chapter" inputProps={{ type: "number", min: 1, max: manga.chapters }} />
            )}
          />
        </form>

        <DialogFooter>
          <DialogClose>Close</DialogClose>

          <form.AppForm>
            <form.SubmitButton form="set-last-chapter-read-form">Save</form.SubmitButton>
          </form.AppForm>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface Props {
  manga: OrpcClientOutputs["mangas"]["get"];
}

export function MangaActions({ manga }: Props) {
  const { id, userProgress } = manga;
  const [isChapterNumberDialogFormOpen, setIsChapterNumberDialogFormOpen] = useState(false);

  function onSuccess() {
    void queryClient.invalidateQueries(
      orpc.mangas.get.queryOptions({ input: { mangaUpdatesId: manga.mangaUpdatesId } }),
    );
  }

  const setLastChapterReadMutation = useMutation(
    orpc.mangas.setLastChapterRead.mutationOptions({
      onSuccess: () => {
        onSuccess();

        setIsChapterNumberDialogFormOpen(false);
      },
    }),
  );
  const unreadMutation = useMutation(orpc.mangas.unread.mutationOptions({ onSuccess }));
  const addToReadingListMutation = useMutation(orpc.mangas.addToReadingList.mutationOptions({ onSuccess }));
  const removeFromReadingListMutation = useMutation(orpc.mangas.removeFromReadingList.mutationOptions({ onSuccess }));
  const abandonMutation = useMutation(orpc.mangas.abandon.mutationOptions({ onSuccess }));
  const unabandonMutation = useMutation(orpc.mangas.unabandon.mutationOptions({ onSuccess }));

  const toggleToWatchStatus = () => {
    if (userProgress?.status === "TO_READ") {
      removeFromReadingListMutation.mutate({ id });
    } else {
      addToReadingListMutation.mutate({ id });
    }
  };

  const toggleAbandonedStatus = () => {
    if (userProgress?.status === "ABANDONED") {
      unabandonMutation.mutate({ id });
    } else {
      abandonMutation.mutate({ id });
    }
  };

  const readPercentage = Math.round(((userProgress?.lastChapterRead ?? 0) / manga.chapters) * 100);

  return (
    <>
      <div className="flex flex-col gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {userProgress?.lastChapterRead ? (
              <div>
                <Button
                  size="lg"
                  className="h-12 w-full justify-start gap-4 rounded-none bg-teal-500 px-2 text-white hover:bg-teal-500/80"
                >
                  <CheckIcon className="size-6" />

                  <div className="text-left">
                    <p className="text-sm uppercase">{readPercentage}% Read</p>
                    <p className="text-xs">
                      {userProgress.lastChapterRead}/{manga.chapters} chapters
                    </p>
                  </div>
                </Button>

                <Progress value={readPercentage} className="rounded-none bg-teal-600/40 *:bg-teal-400" />
              </div>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="h-12 justify-start gap-4 border-teal-500 px-2 text-base text-teal-500 uppercase hover:bg-teal-500 hover:text-white"
              >
                <EyeOffIcon />
                <span>Read</span>
              </Button>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent className="dropdown-menu-content">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {userProgress?.status !== "READ" ? (
              <DropdownMenuItem onClick={() => setIsChapterNumberDialogFormOpen(true)}>
                Read till chapter X
              </DropdownMenuItem>
            ) : null}

            {userProgress?.lastChapterRead && userProgress.status !== "READ" && readPercentage !== 100 ? (
              <DropdownMenuItem onClick={() => setLastChapterReadMutation.mutate({ id, chapter: manga.chapters })}>
                Read remaining chapters
              </DropdownMenuItem>
            ) : null}

            {userProgress?.lastChapterRead ? (
              <DropdownMenuItem onClick={() => unreadMutation.mutate({ id })} className="text-destructive">
                Unread all chapters
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => setLastChapterReadMutation.mutate({ id, chapter: manga.chapters })}>
                Read all chapters
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {!userProgress?.status || userProgress.status === "TO_READ" ? (
          <Button
            onClick={toggleToWatchStatus}
            disabled={addToReadingListMutation.isPending || removeFromReadingListMutation.isPending}
            variant="outline"
            size="lg"
            className={cn(
              "h-12 justify-start gap-4 border-sky-500 px-2 text-base uppercase",
              userProgress?.status === "TO_READ"
                ? "bg-sky-500 text-white hover:border-sky-600 hover:bg-sky-600 hover:text-white"
                : "text-sky-500 hover:bg-sky-500 hover:text-white",
            )}
          >
            {userProgress?.status === "TO_READ" ? <ListPlusIcon /> : <ListMinusIcon />}
            <span>{userProgress?.status === "TO_READ" ? "To read" : "Add to reading list"}</span>
          </Button>
        ) : null}

        {userProgress?.status === "READING" || userProgress?.status === "ABANDONED" ? (
          <Button
            onClick={toggleAbandonedStatus}
            disabled={abandonMutation.isPending || unabandonMutation.isPending}
            variant="outline"
            size="lg"
            className={cn(
              "h-12 justify-start gap-4 border-indigo-500 px-2 text-base uppercase",
              userProgress.status === "ABANDONED"
                ? "bg-indigo-500 text-white hover:border-indigo-600 hover:bg-indigo-600 hover:text-white"
                : "text-indigo-500 hover:bg-indigo-500 hover:text-white",
            )}
          >
            {userProgress.status === "ABANDONED" ? <ListPlusIcon /> : <ListMinusIcon />}
            <span>{userProgress.status === "ABANDONED" ? "Abandoned" : "Set as abandoned"}</span>
          </Button>
        ) : null}
      </div>

      {isChapterNumberDialogFormOpen ? (
        <ChapterNumberDialogForm
          onOpenChange={setIsChapterNumberDialogFormOpen}
          manga={manga}
          onSubmit={(chapter) => setLastChapterReadMutation.mutate({ id, chapter })}
        />
      ) : null}
    </>
  );
}
