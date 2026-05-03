import { useState } from "react";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { BookOpenIcon, ExternalLinkIcon, FlameIcon, UtensilsIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@omnifex/ui/components/ui/alert-dialog";
import { Badge } from "@omnifex/ui/components/ui/badge";
import { Button } from "@omnifex/ui/components/ui/button";
import { Separator } from "@omnifex/ui/components/ui/separator";
import { Spinner } from "@omnifex/ui/components/ui/spinner";

export const Route = createFileRoute("/recipes_/$id")({
  component: Component,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

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

        {recipe.calories ? (
          <Badge className="bg-amber-100 py-1 text-amber-700">
            <FlameIcon data-icon="inline-start" />
            {recipe.calories} calories
          </Badge>
        ) : null}

        <Separator />

        <div className="grid gap-10 md:grid-cols-[300px_1fr]">
          <aside className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <UtensilsIcon className="size-4 text-amber-600" />
                <h2 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">Ingredients</h2>
              </div>

              <div className="rounded-2xl bg-stone-50 p-5">
                <ul className="divide-y divide-stone-100">
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient.id} className="flex items-baseline justify-between py-2.5 first:pt-0 last:pb-0">
                      <span className="text-sm font-medium">{ingredient.name}</span>
                      <Badge variant="outline" className="bg-white">
                        {ingredient.quantity} {ingredient.unit}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {recipe.links.length > 0 ? (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <ExternalLinkIcon className="size-4 text-amber-600" />
                  <h2 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">References</h2>
                </div>

                <ul className="space-y-2">
                  {recipe.links.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-xl bg-stone-50 px-4 py-2.5 text-sm transition-colors hover:bg-amber-50"
                      >
                        <ExternalLinkIcon className="size-4 shrink-0 text-amber-600" />
                        <span className="truncate">{link.text ?? link.link}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpenIcon className="size-4 text-amber-600" />
              <h2 className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">Instructions</h2>
            </div>

            <ol className="space-y-2">
              {recipe.instructions.map((instruction, index) => (
                <li
                  key={`instruction-${index}`}
                  className="group flex gap-4 rounded-2xl bg-stone-50 p-5 transition-colors hover:bg-amber-50/60"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 group-hover:bg-amber-200">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{instruction}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
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
