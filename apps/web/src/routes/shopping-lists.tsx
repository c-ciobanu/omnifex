import type { OrpcClientOutputs } from "@/utils/orpc";
import { useState } from "react";
import { ShoppingListModal } from "@/components/shopping-list-modal";
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

type ShoppingList = OrpcClientOutputs["shoppingLists"]["getAll"][number];

export const Route = createFileRoute("/shopping-lists")({
  component: Component,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

function Component() {
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);
  const [shoppingListToUpdate, setShoppingListToUpdate] = useState<ShoppingList>();
  const [shoppingListDelete, setShoppingListDelete] = useState<ShoppingList>();

  const { data: shoppingLists, isLoading } = useQuery(orpc.shoppingLists.getAll.queryOptions());

  const createShoppingListMutation = useMutation(
    orpc.shoppingLists.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.shoppingLists.getAll.queryOptions());

        setShowShoppingListModal(false);
      },
    }),
  );

  const updateShoppingListMutation = useMutation(
    orpc.shoppingLists.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.shoppingLists.getAll.queryOptions());

        setShowShoppingListModal(false);
        setShoppingListToUpdate(undefined);
      },
    }),
  );

  const deleteShoppingListMutation = useMutation(
    orpc.shoppingLists.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.shoppingLists.getAll.queryOptions());

        setShoppingListDelete(undefined);
      },
    }),
  );

  if (isLoading || !shoppingLists) {
    return <Spinner />;
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-3xl font-bold">Shopping Lists</h2>

        <Button onClick={() => setShowShoppingListModal(true)}>
          <PlusIcon />
          New Shopping List
        </Button>
      </div>

      <ul className="divide-y divide-white">
        {shoppingLists.map((shoppingList) => (
          <li key={shoppingList.id} className="flex items-center justify-between gap-6 py-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{shoppingList.name}</p>

              <p className="text-muted-foreground text-xs">
                {shoppingList.items.filter((i) => !i.bought).length} / {shoppingList.items.length} items left to buy
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <Button asChild variant="outline">
                <Link to="/shopping-lists/$id" params={{ id: shoppingList.id }} title={shoppingList.name}>
                  View Shopping List
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
                      setShowShoppingListModal(true);
                      setShoppingListToUpdate(shoppingList);
                    }}
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShoppingListDelete(shoppingList)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>

      {showShoppingListModal ? (
        <ShoppingListModal
          defaultValues={shoppingListToUpdate}
          onClose={() => {
            setShowShoppingListModal(false);
            setShoppingListToUpdate(undefined);
          }}
          onSubmit={(data) => {
            if (shoppingListToUpdate) {
              updateShoppingListMutation.mutate({ ...data, id: shoppingListToUpdate.id });
            } else {
              createShoppingListMutation.mutate(data);
            }
          }}
        />
      ) : null}

      {shoppingListDelete ? (
        <AlertDialog open={true} onOpenChange={() => setShoppingListDelete(undefined)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete shopping list?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the shopping list &#34;{shoppingListDelete.name}&#34;?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => deleteShoppingListMutation.mutate({ id: shoppingListDelete.id })}
                disabled={deleteShoppingListMutation.isPending}
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
