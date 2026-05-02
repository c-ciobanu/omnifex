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

type Recipe = OrpcClientOutputs["recipes"]["getAll"][number];

export const Route = createFileRoute("/recipes")({
  component: Component,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

function Component() {
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe>();

  const { data: recipes, isLoading } = useQuery(orpc.recipes.getAll.queryOptions());

  const deleteRecipeMutation = useMutation(
    orpc.recipes.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.recipes.getAll.queryOptions());

        setRecipeToDelete(undefined);
      },
    }),
  );

  if (isLoading || !recipes) {
    return <Spinner />;
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold md:text-2xl">Recipes</h2>

        <Button asChild>
          <Link to="/recipes/new">
            <PlusIcon />
            New Recipe
          </Link>
        </Button>
      </div>

      <ul className="divide-y divide-white">
        {recipes.map((recipe) => (
          <li key={recipe.id} className="flex items-center justify-between gap-6 py-4">
            <p className="text-sm font-medium">{recipe.name}</p>

            <div className="flex shrink-0 items-center gap-4">
              <Button asChild variant="outline">
                <Link to="/recipes/$id" params={{ id: recipe.id }} title={recipe.name}>
                  View Recipe
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
                  <DropdownMenuItem asChild>
                    <Link to="/recipes/$id/edit" params={{ id: recipe.id }}>
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRecipeToDelete(recipe)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>

      {recipeToDelete ? (
        <AlertDialog open={true} onOpenChange={() => setRecipeToDelete(undefined)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete recipe?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the recipe &#34;{recipeToDelete.name}&#34;?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => deleteRecipeMutation.mutate({ id: recipeToDelete.id })}
                disabled={deleteRecipeMutation.isPending}
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
