import { useReducer, useState } from "react";
import { EditMetricEntryModal } from "@/components/edit-metric-entry-modal";
import { MetricEntryChart } from "@/components/metric-entry-chart";
import { NewMetricEntryModal } from "@/components/new-metric-entry-modal";
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
import { createFileRoute, redirect } from "@tanstack/react-router";
import { MoreVerticalIcon, PlusIcon } from "lucide-react";

export const Route = createFileRoute("/metrics_/$id")({
  component: Component,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

const initialState = { isOpen: false, metricEntryIndex: -1 };

type Action = { type: "setIsOpen"; nextIsOpen: boolean } | { type: "open"; nextMetricEntryIndex: number };

function reducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case "setIsOpen": {
      return {
        metricEntryIndex: action.nextIsOpen ? state.metricEntryIndex : initialState.metricEntryIndex,
        isOpen: action.nextIsOpen,
      };
    }
    case "open": {
      return {
        metricEntryIndex: action.nextMetricEntryIndex,
        isOpen: true,
      };
    }
  }
}

function Component() {
  const { id } = Route.useParams();

  const [deleteState, deleteDispatch] = useReducer(reducer, initialState);
  const [editState, editDispatch] = useReducer(reducer, initialState);
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useQuery(orpc.metrics.get.queryOptions({ input: { id: Number(id) } }));

  const deleteMetricEntryMutation = useMutation(
    orpc.metrics.deleteEntry.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.metrics.get.queryOptions({ input: { id: Number(id) } }));

        deleteDispatch({ type: "setIsOpen", nextIsOpen: false });
      },
    }),
  );

  if (isLoading || !data) {
    return <Spinner />;
  }

  const metricEntryToUpdate = data.entries[editState.metricEntryIndex];
  const metricEntryToDelete = data.entries[deleteState.metricEntryIndex];

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold md:text-2xl">{data.name}</h2>

        <Button onClick={() => setIsOpen(true)}>
          <PlusIcon />
          New Entry
        </Button>
      </div>

      <MetricEntryChart metricName={data.name} entries={data.entries} />

      <ul className="mt-4 divide-y divide-white">
        {data.entries.map((entry, index) => (
          <li key={entry.id} className="flex items-center justify-between gap-6 py-4">
            <time dateTime={entry.date.toLocaleDateString()} className="text-sm font-medium">
              {entry.date.toLocaleDateString()}
            </time>

            <div className="flex shrink-0 items-center gap-4">
              <p className="text-muted-foreground text-sm">
                {entry.value} {data.unit}
              </p>

              <DropdownMenu>
                <Button asChild variant="ghost" size="icon">
                  <DropdownMenuTrigger>
                    <MoreVerticalIcon className="h-4 w-4" />
                  </DropdownMenuTrigger>
                </Button>

                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => editDispatch({ type: "open", nextMetricEntryIndex: index })}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteDispatch({ type: "open", nextMetricEntryIndex: index })}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>

      <NewMetricEntryModal
        key={data.entries.length}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        metric={data}
        onCompleted={async () => {
          await queryClient.invalidateQueries(orpc.metrics.get.queryOptions({ input: { id: Number(id) } }));
        }}
      />

      {metricEntryToUpdate ? (
        <EditMetricEntryModal
          isOpen={editState.isOpen}
          setIsOpen={(open: boolean) => editDispatch({ type: "setIsOpen", nextIsOpen: open })}
          metric={data}
          metricEntry={metricEntryToUpdate}
        />
      ) : null}

      {metricEntryToDelete ? (
        <AlertDialog
          open={deleteState.isOpen}
          onOpenChange={(open) => deleteDispatch({ type: "setIsOpen", nextIsOpen: open })}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Metric Entry?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the {metricEntryToDelete.date.toLocaleDateString()} metric entry?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => deleteMetricEntryMutation.mutate({ id: metricEntryToDelete.id })}
                disabled={deleteMetricEntryMutation.isPending}
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
