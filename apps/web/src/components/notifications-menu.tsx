import { orpc, queryClient } from "@/utils/orpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { intlFormatDistance } from "date-fns";
import { millisecondsInMinute } from "date-fns/constants";
import { BellIcon } from "lucide-react";

import { Badge } from "@omnifex/ui/components/ui/badge";
import { Button } from "@omnifex/ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@omnifex/ui/components/ui/dropdown-menu";
import { cn } from "@omnifex/ui/lib/utils";

export function NotificationsMenu() {
  const { data: unreadCount = 0 } = useQuery(
    orpc.notifications.getUnreadCount.queryOptions({ refetchInterval: millisecondsInMinute }),
  );

  const { data: notifications = [] } = useQuery(
    orpc.notifications.getRecent.queryOptions({ refetchInterval: millisecondsInMinute }),
  );

  const markAsReadMutation = useMutation(
    orpc.notifications.markAsRead.mutationOptions({
      onSuccess: async () => {
        await invalidateNotifications();
      },
    }),
  );

  const markAllAsReadMutation = useMutation(
    orpc.notifications.markAllAsRead.mutationOptions({
      onSuccess: async () => {
        await invalidateNotifications();
      },
    }),
  );

  async function invalidateNotifications() {
    await queryClient.invalidateQueries(orpc.notifications.getUnreadCount.queryOptions());
    await queryClient.invalidateQueries(orpc.notifications.getRecent.queryOptions());
  }

  function handleNotificationClick(notification: (typeof notifications)[number]) {
    if (!notification.readAt) {
      markAsReadMutation.mutate({ id: notification.id });
    }
  }

  return (
    <DropdownMenu>
      <Button asChild variant="ghost" size="icon" className="relative text-gray-300">
        <DropdownMenuTrigger>
          <BellIcon className="size-6" />

          {unreadCount > 0 ? (
            <Badge className="absolute -right-1 -bottom-1 size-5 rounded-full p-0 text-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          ) : null}
        </DropdownMenuTrigger>
      </Button>

      <DropdownMenuContent align="end" className="max-h-80 w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>

          {unreadCount > 0 ? (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => markAllAsReadMutation.mutate({})}
              disabled={markAllAsReadMutation.isPending}
            >
              Mark all read
            </Button>
          ) : null}
        </div>

        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <p className="text-muted-foreground px-2 py-6 text-center text-sm">No notifications yet</p>
        ) : (
          <>
            {notifications.map((notification) => (
              <DropdownMenuItem key={notification.id} asChild>
                <Link to="/reminders" onClick={() => handleNotificationClick(notification)}>
                  <div className="flex flex-col gap-0.5">
                    <p className={cn("text-sm", notification.readAt ? "text-muted-foreground" : "font-medium")}>
                      {notification.title}
                    </p>

                    {notification.body ? (
                      <p
                        className={cn(
                          "line-clamp-2 text-xs",
                          notification.readAt ? "text-muted-foreground" : "font-medium",
                        )}
                      >
                        {notification.body}
                      </p>
                    ) : null}

                    <p className="text-muted-foreground text-xs">
                      {intlFormatDistance(notification.createdAt, new Date())}
                    </p>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
