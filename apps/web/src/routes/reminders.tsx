import type { OrpcClientBodyInputs, OrpcClientOutputs } from "@/utils/orpc";
import { useState } from "react";
import { ReminderModal } from "@/components/reminder-modal";
import { orpc, queryClient } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { intlFormat } from "date-fns";
import { MoreVerticalIcon, PlusIcon } from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@omnifex/ui/components/ui/dropdown-menu";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@omnifex/ui/components/ui/empty";
import { Spinner } from "@omnifex/ui/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@omnifex/ui/components/ui/tabs";

type Reminder = OrpcClientOutputs["reminders"]["getAll"][number];
type Filter = OrpcClientBodyInputs["reminders"]["getAll"]["filter"];

export const Route = createFileRoute("/reminders")({
  component: Component,
  beforeLoad: ({ context, location }) => {
    if (!context.auth?.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
  },
});

function Component() {
  const [tab, setTab] = useState<Filter>("upcoming");
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderToUpdate, setReminderToUpdate] = useState<Reminder>();
  const [reminderToDelete, setReminderToDelete] = useState<Reminder>();

  const { data: reminders, isLoading } = useQuery(orpc.reminders.getAll.queryOptions({ input: { filter: tab } }));

  const createReminderMutation = useMutation(
    orpc.reminders.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.reminders.getAll.queryOptions({ input: { filter: tab } }));

        setShowReminderModal(false);
      },
    }),
  );

  const updateReminderMutation = useMutation(
    orpc.reminders.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.reminders.getAll.queryOptions({ input: { filter: tab } }));

        setShowReminderModal(false);
        setReminderToUpdate(undefined);
      },
    }),
  );

  const deleteReminderMutation = useMutation(
    orpc.reminders.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(orpc.reminders.getAll.queryOptions({ input: { filter: tab } }));

        setReminderToDelete(undefined);
      },
    }),
  );

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold md:text-2xl">Reminders</h2>

        <Button onClick={() => setShowReminderModal(true)}>
          <PlusIcon />
          New Reminder
        </Button>
      </div>

      <Tabs value={tab} onValueChange={(value) => setTab(value as Filter)}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="previous">Previous</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          {isLoading || !reminders ? (
            <Spinner />
          ) : reminders.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No {tab} reminders</EmptyTitle>
                <EmptyDescription>
                  {tab === "upcoming"
                    ? "Create a reminder to get notified when it is due."
                    : "Past reminders will appear here."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ul className="divide-y divide-white">
              {reminders.map((reminder) => (
                <li key={reminder.id} className="flex items-center justify-between gap-6 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{reminder.title}</p>

                    {reminder.notes ? <p className="text-muted-foreground text-xs">{reminder.notes}</p> : null}

                    <p className="text-muted-foreground text-xs">
                      {intlFormat(reminder.date, { dateStyle: "short", timeStyle: "short" })}
                    </p>
                  </div>

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
                          setReminderToUpdate(reminder);
                          setShowReminderModal(true);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setReminderToDelete(reminder)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>

      {showReminderModal ? (
        <ReminderModal
          defaultValues={reminderToUpdate}
          onClose={() => {
            setShowReminderModal(false);
            setReminderToUpdate(undefined);
          }}
          onSubmit={(formData) => {
            if (reminderToUpdate) {
              updateReminderMutation.mutate({ ...formData, id: reminderToUpdate.id });
            } else {
              createReminderMutation.mutate(formData);
            }
          }}
        />
      ) : null}

      {reminderToDelete ? (
        <AlertDialog open={true} onOpenChange={() => setReminderToDelete(undefined)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete reminder?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the reminder &#34;{reminderToDelete.title}&#34;?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                variant="destructive"
                onClick={() => deleteReminderMutation.mutate({ id: reminderToDelete.id })}
                disabled={deleteReminderMutation.isPending}
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
