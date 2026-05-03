import { useState } from "react";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@omnifex/ui/components/ui/alert-dialog";
import { Button } from "@omnifex/ui/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@omnifex/ui/components/ui/card";
import { Spinner } from "@omnifex/ui/components/ui/spinner";

export const Route = createFileRoute("/recipes_/$id")({
  component: Component,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

function formatIngredient(quantity: string, unit: string | null, name: string) {
  return [quantity, unit, name].filter(Boolean).join(" ");
}

function Component() {
  const { id } = Route.useParams();
  const router = useRouter();

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: recipe, isLoading } = useQuery(orpc.recipes.get.queryOptions({ input: { id } }));

  const deleteRecipeMutation = useMutation(
    orpc.recipes.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.recipes.getAll.queryOptions());

        await router.navigate({ to: "/recipes" });
      },
    }),
  );

  if (isLoading || !recipe) {
    return <Spinner />;
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold md:text-2xl">{recipe.name}</h2>

          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to="/recipes/$id/edit" params={{ id }}>
                Edit
              </Link>
            </Button>

            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              Delete
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>

          <CardContent>
            <ul className="list-inside list-disc">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id}>{formatIngredient(ingredient.quantity, ingredient.unit, ingredient.name)}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>

          <CardContent>
            <ol className="list-inside list-decimal">
              {recipe.instructions.map((instruction, index) => (
                <li key={`instruction-${index}`}>{instruction}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete recipe?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the recipe &#34;{recipe.name}&#34;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => deleteRecipeMutation.mutate({ id })}
              disabled={deleteRecipeMutation.isPending}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
