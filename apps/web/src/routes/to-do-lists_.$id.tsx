import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldGroup } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useAppForm } from "@/hooks/form";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { PlusIcon, Trash2Icon } from "lucide-react";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().trim().min(1),
});

export const Route = createFileRoute("/to-do-lists_/$id")({
  component: Component,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

function Component() {
  const { id } = Route.useParams();

  const { data: toDoList, isLoading } = useQuery(orpc.toDoLists.get.queryOptions({ input: { id } }));

  const createItemMutation = useMutation(
    orpc.toDoLists.createItem.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.toDoLists.get.queryOptions({ input: { id } }));

        form.reset();
      },
    }),
  );

  const updateItemMutation = useMutation(
    orpc.toDoLists.updateItem.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.toDoLists.get.queryOptions({ input: { id } }));
      },
    }),
  );

  const deleteItemMutation = useMutation(
    orpc.toDoLists.deleteItem.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.toDoLists.get.queryOptions({ input: { id } }));
      },
    }),
  );

  const form = useAppForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      const data = formSchema.parse(value);

      createItemMutation.mutate({ ...data, listId: id });
    },
  });

  if (isLoading || !toDoList) {
    return <Spinner />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold">{toDoList.name} To Do List</h2>

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          await form.handleSubmit();
        }}
        className="flex gap-2"
      >
        <FieldGroup>
          <form.AppField
            name="name"
            children={(field) => <field.InputField inputProps={{ placeholder: "Add new item" }} />}
          />
        </FieldGroup>

        <form.AppForm>
          <form.SubmitButton>
            <PlusIcon />
            Add
          </form.SubmitButton>
        </form.AppForm>
      </form>

      <ul className="divide-border divide-y">
        {toDoList.items.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={item.completed}
                onCheckedChange={(checked) => {
                  updateItemMutation.mutate({ id: item.id, listId: id, completed: Boolean(checked) });
                }}
              />
              <span className={item.completed ? "text-muted-foreground line-through" : ""}>{item.name}</span>
            </div>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => deleteItemMutation.mutate({ id: item.id })}
              disabled={deleteItemMutation.isPending}
            >
              <Trash2Icon aria-hidden="true" />
              <span className="sr-only">Delete {item.name}</span>
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
