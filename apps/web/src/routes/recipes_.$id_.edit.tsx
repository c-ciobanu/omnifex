import { RecipeForm } from "@/components/recipe-form";
import { Spinner } from "@/components/ui/spinner";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/recipes_/$id_/edit")({
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

  const { data: recipe, isLoading } = useQuery(orpc.recipes.get.queryOptions({ input: { id } }));

  const updateRecipeMutation = useMutation(
    orpc.recipes.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.recipes.get.queryOptions({ input: { id } }));

        await router.navigate({ to: "/recipes/$id", params: { id } });
      },
    }),
  );

  if (isLoading || !recipe) {
    return <Spinner />;
  }

  return (
    <>
      <h2 className="mb-4 text-lg font-semibold md:text-2xl">Edit Recipe</h2>

      <RecipeForm
        defaultValues={recipe}
        onSubmit={async (data) => {
          await updateRecipeMutation.mutateAsync({ ...data, id });
        }}
      />
    </>
  );
}
