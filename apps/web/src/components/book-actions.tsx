import type { OrpcClientOutputs } from "@/utils/orpc";
import { cn } from "@/lib/utils";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon, ListMinusIcon, ListPlusIcon } from "lucide-react";

import { Button } from "./ui/button";

interface Props {
  book: OrpcClientOutputs["books"]["get"];
}

export function BookActions({ book }: Props) {
  const { id, googleId, userInfo } = book;
  const { read, inReadingList } = userInfo ?? {};

  function onSuccess() {
    void queryClient.invalidateQueries(orpc.books.get.queryOptions({ input: { googleId } }));
  }

  const readMutation = useMutation(orpc.books.read.mutationOptions({ onSuccess }));
  const unreadMutation = useMutation(orpc.books.unread.mutationOptions({ onSuccess }));
  const readingListMutation = useMutation(orpc.books.readingList.mutationOptions({ onSuccess }));
  const unreadingListMutation = useMutation(orpc.books.unreadingList.mutationOptions({ onSuccess }));

  const toggleReadStatus = () => {
    if (read) {
      unreadMutation.mutate({ id });
    } else {
      readMutation.mutate({ id });
    }
  };

  const toggleToReadStatus = () => {
    if (inReadingList) {
      unreadingListMutation.mutate({ id });
    } else {
      readingListMutation.mutate({ id });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button
        onClick={toggleReadStatus}
        disabled={unreadMutation.isPending || unreadMutation.isPending}
        variant="outline"
        className={cn(
          "h-12 justify-start gap-4 border-teal-500 px-2 text-base uppercase",
          read
            ? "bg-teal-500 text-white hover:border-teal-600 hover:bg-teal-600 hover:text-white"
            : "text-teal-500 hover:bg-teal-500 hover:text-white",
        )}
      >
        {read ? <EyeIcon /> : <EyeOffIcon />}
        <span>{read ? "Read" : "Set as read"}</span>
      </Button>

      {read ? null : (
        <Button
          onClick={toggleToReadStatus}
          disabled={readingListMutation.isPending || unreadingListMutation.isPending}
          variant="outline"
          className={cn(
            "h-12 justify-start gap-4 border-sky-500 px-2 text-base uppercase",
            inReadingList
              ? "bg-sky-500 text-white hover:border-sky-600 hover:bg-sky-600 hover:text-white"
              : "text-sky-500 hover:bg-sky-500 hover:text-white",
          )}
        >
          {inReadingList ? <ListPlusIcon /> : <ListMinusIcon />}
          <span>{inReadingList ? "Listed on reading list" : "Add to reading list"}</span>
        </Button>
      )}
    </div>
  );
}
