import type { OrpcClientOutputs } from "@/utils/orpc";
import { useState } from "react";
import { ToDoListModal } from "@/components/to-do-list-modal";
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
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { MoreVerticalIcon, PlusIcon } from "lucide-react";

type ToDoList = OrpcClientOutputs["toDoLists"]["getAll"][number];

export const Route = createFileRoute("/to-do-lists")({
  component: Component,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

function Component() {
  const [showToDoListModal, setShowToDoListModal] = useState(false);
  const [toDoListToUpdate, setToDoListToUpdate] = useState<ToDoList>();
  const [toDoListDelete, setToDoListDelete] = useState<ToDoList>();

  const { data: toDoLists, isLoading } = useQuery(orpc.toDoLists.getAll.queryOptions());

  const createToDoListMutation = useMutation(
    orpc.toDoLists.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.toDoLists.getAll.queryOptions());

        setShowToDoListModal(false);
      },
    }),
  );

  const updateToDoListMutation = useMutation(
    orpc.toDoLists.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.toDoLists.getAll.queryOptions());

        setShowToDoListModal(false);
        setToDoListToUpdate(undefined);
      },
    }),
  );

  const deleteToDoListMutation = useMutation(
    orpc.toDoLists.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.toDoLists.getAll.queryOptions());

        setToDoListDelete(undefined);
      },
    }),
  );

  if (isLoading || !toDoLists) {
    return <Spinner />;
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl font-bold">To Do Lists</h2>

        <Button onClick={() => setShowToDoListModal(true)}>
          <PlusIcon />
          New To Do List
        </Button>
      </div>

      <ul className="divide-y divide-white">
        {toDoLists.map((toDoList) => (
          <li key={toDoList.id} className="flex items-center justify-between gap-6 py-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{toDoList.name}</p>

              <p className="text-muted-foreground text-xs">
                {toDoList.items.filter((i) => !i.completed).length} / {toDoList.items.length} items left to do
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <Button asChild variant="outline">
                <Link to="/to-do-lists/$id" params={{ id: toDoList.id }} title={toDoList.name}>
                  View To Do List
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
                  <DropdownMenuItem
                    onClick={() => {
                      setShowToDoListModal(true);
                      setToDoListToUpdate(toDoList);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setToDoListDelete(toDoList)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>

      {showToDoListModal ? (
        <ToDoListModal
          defaultValues={toDoListToUpdate}
          onClose={() => {
            setShowToDoListModal(false);
            setToDoListToUpdate(undefined);
          }}
          onSubmit={(data) => {
            if (toDoListToUpdate) {
              updateToDoListMutation.mutate({ ...data, id: toDoListToUpdate.id });
            } else {
              createToDoListMutation.mutate(data);
            }
          }}
        />
      ) : null}

      {toDoListDelete ? (
        <AlertDialog open={true} onOpenChange={() => setToDoListDelete(undefined)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete to do list?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the to do list &#34;{toDoListDelete.name}&#34;?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => deleteToDoListMutation.mutate({ id: toDoListDelete.id })}
                disabled={deleteToDoListMutation.isPending}
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
