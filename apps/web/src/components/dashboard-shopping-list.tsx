import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

export function DashboardShoppingList() {
  const { data: list, isLoading } = useQuery(orpc.shoppingLists.getForDashboard.queryOptions());

  if (isLoading) {
    return <Spinner />;
  }

  if (!list) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Shopping List</CardTitle>
        <CardDescription>{list.name}</CardDescription>
        <CardAction>
          <Button asChild variant="outline" size="sm">
            <Link to="/shopping-lists/$id" params={{ id: list.id }}>
              Manage Shopping List
            </Link>
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {list.items.length > 0 ? (
          <ul className="list-inside list-disc space-y-2">
            {list.items.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">Nothing left to buy</p>
        )}
      </CardContent>
    </Card>
  );
}
