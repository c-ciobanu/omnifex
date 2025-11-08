import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { getTime } from "date-fns";
import { MoreVerticalIcon, PlusIcon } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";

import type { Invoice } from "./invoices_.new";

export const Route = createFileRoute("/invoices")({
  component: Component,
});

function Component() {
  const navigate = useNavigate();
  const router = useRouter();

  const [invoices, setInvoices] = useLocalStorage<Invoice[]>("invoices", []);

  const sortedInvoices = invoices.sort((a, b) => getTime(b.issueDate) - getTime(a.issueDate));

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button asChild>
          <Link to="/invoices/new" title="New Invoice">
            <PlusIcon /> New Invoice
          </Link>
        </Button>
      </div>

      <ul className="divide-y divide-white">
        {sortedInvoices.map((invoice) => (
          <li key={invoice.id} className="flex items-center justify-between gap-6 py-4">
            <p className="text-sm font-medium">{invoice.number}</p>

            <div className="flex shrink-0 items-center gap-4">
              <Button asChild variant="outline">
                <Link to="/invoices/$id" params={{ id: invoice.id }} title={invoice.number}>
                  View Invoice
                </Link>
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
                  <DropdownMenuItem onClick={() => navigate({ to: "/invoices/new", search: { copy: invoice.id } })}>
                    Add Next
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      window.open(
                        router.buildLocation({ to: "/invoices/$id/preview", params: { id: invoice.id } }).url,
                        "_blank",
                      )
                    }
                  >
                    Print
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setInvoices((state) => state.filter((el) => el.id !== invoice.id))}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
