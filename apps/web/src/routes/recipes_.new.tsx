import { RecipeForm } from "@/components/recipe-form";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/recipes_/new")({
  component: Component,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

function Component() {
  const router = useRouter();

  const createRecipeMutation = useMutation(
    orpc.recipes.create.mutationOptions({
      onSuccess: async (recipe) => {
        await queryClient.invalidateQueries(orpc.recipes.getAll.queryOptions());

        await router.navigate({ to: "/recipes/$id", params: { id: recipe.id } });
      },
    }),
  );

  return (
    <>
      <h2 className="mb-4 text-lg font-semibold md:text-2xl">New Recipe</h2>

      <RecipeForm
        onSubmit={async (data) => {
          await createRecipeMutation.mutateAsync(data);
        }}
      />
    </>
  );
}
