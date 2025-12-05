import { useReducer } from "react";
import { EditMetricModal } from "@/components/edit-metric-modal";
import { NewMetric } from "@/components/new-metric";
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
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { isAfter, isBefore, isToday, subWeeks } from "date-fns";
import { MoreVerticalIcon, PlusIcon } from "lucide-react";

export const Route = createFileRoute("/metrics")({
  component: Component,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

const getMetricDateColor = (date: Date) => {
  if (isToday(date)) {
    return "text-green-500";
  }

  const now = new Date();

  if (isAfter(date, subWeeks(now, 1))) {
    return "text-yellow-500";
  }

  if (isBefore(date, subWeeks(now, 1))) {
    return "text-red-500";
  }

  return undefined;
};

const initialState = { isOpen: false, metricIndex: -1 };

type Action = { type: "setIsOpen"; nextIsOpen: boolean } | { type: "open"; nextMetricIndex: number };

function reducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case "setIsOpen": {
      return {
        metricIndex: action.nextIsOpen ? state.metricIndex : initialState.metricIndex,
        isOpen: action.nextIsOpen,
      };
    }
    case "open": {
      return {
        metricIndex: action.nextMetricIndex,
        isOpen: true,
      };
    }
  }
}

function Component() {
  const [deleteState, deleteDispatch] = useReducer(reducer, initialState);
  const [editState, editDispatch] = useReducer(reducer, initialState);
  const [newEntryState, newEntryDispatch] = useReducer(reducer, initialState);

  const deleteMetricMutation = useMutation(
    orpc.metrics.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.metrics.getAll.queryOptions());

        deleteDispatch({ type: "setIsOpen", nextIsOpen: false });
      },
    }),
  );

  const createMetricEntryMutation = useMutation(
    orpc.metrics.createEntry.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.metrics.getAll.queryOptions());

        deleteDispatch({ type: "setIsOpen", nextIsOpen: false });
      },
    }),
  );

  const { data, isLoading } = useQuery(orpc.metrics.getAll.queryOptions());

  if (isLoading || !data) {
    return <Spinner />;
  }

  const metricToUpdate = data[editState.metricIndex];
  const metricToDelete = data[deleteState.metricIndex];
  const metricForNewEntry = data[newEntryState.metricIndex];

  return (
    <>
      <div className="mb-4 flex justify-end">
        <NewMetric />
      </div>

      <ul className="divide-y divide-white">
        {data.map((metric, index) => (
          <li key={metric.id} className="flex items-center justify-between gap-6 py-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{metric.name}</p>
              {metric.latestEntry ? (
                <p className="text-muted-foreground text-xs">
                  <time
                    dateTime={metric.latestEntry.date.toLocaleDateString()}
                    className={getMetricDateColor(metric.latestEntry.date)}
                  >
                    {metric.latestEntry.date.toLocaleDateString()}
                  </time>
                  {" • "}
                  {metric.latestEntry.value} {metric.unit}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <Button asChild variant="outline">
                <Link to="/metrics/$id" params={{ id: String(metric.id) }} title={metric.name}>
                  View Metric
                </Link>
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => newEntryDispatch({ type: "open", nextMetricIndex: index })}
              >
                <PlusIcon />
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
                      if (!metric.latestEntry) {
                        return;
                      }

                      createMetricEntryMutation.mutate({
                        date: new Date().toISOString().substring(0, 10),
                        value: metric.latestEntry.value,
                        metricId: metric.id,
                      });
                    }}
                  >
                    Duplicate Last Entry
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => editDispatch({ type: "open", nextMetricIndex: index })}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deleteDispatch({ type: "open", nextMetricIndex: index })}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>

      {metricForNewEntry ? (
        <NewMetricEntryModal
          isOpen={newEntryState.isOpen}
          setIsOpen={(open: boolean) => newEntryDispatch({ type: "setIsOpen", nextIsOpen: open })}
          metric={metricForNewEntry}
          onCompleted={async () => {
            await queryClient.invalidateQueries(orpc.metrics.getAll.queryOptions());
          }}
        />
      ) : (
        metricForNewEntry
      )}

      {metricToUpdate ? (
        <EditMetricModal
          isOpen={editState.isOpen}
          setIsOpen={(open: boolean) => editDispatch({ type: "setIsOpen", nextIsOpen: open })}
          metric={metricToUpdate}
        />
      ) : null}

      {metricToDelete ? (
        <AlertDialog
          open={deleteState.isOpen}
          onOpenChange={(open) => deleteDispatch({ type: "setIsOpen", nextIsOpen: open })}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Metric?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the metric &#34;{metricToDelete.name}&#34;?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => deleteMetricMutation.mutate({ id: metricToDelete.id })}
                disabled={deleteMetricMutation.isPending}
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
