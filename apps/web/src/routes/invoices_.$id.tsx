import type { InvoiceFormSubmitValues } from "@/components/invoice-form";
import { InvoiceForm } from "@/components/invoice-form";
import { Button } from "@/components/ui/button";
import { createFileRoute, Navigate, useRouter } from "@tanstack/react-router";
import { PrinterIcon } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";

import type { Invoice } from "./invoices_.new";

export const Route = createFileRoute("/invoices_/$id")({
  component: Component,
});

function Component() {
  const { id } = Route.useParams();
  const router = useRouter();

  const [invoices, setInvoices] = useLocalStorage<Invoice[]>("invoices", []);
  const invoice = invoices.find((i) => i.id === id);

  const onSubmit = (data: InvoiceFormSubmitValues) => {
    const conversion = data.conversion?.currency ? data.conversion : undefined;

    const updatedInvoice = { ...data, id, conversion };

    setInvoices((state) => state.map((i) => (i.id === id ? updatedInvoice : i)));
  };

  if (!invoice) {
    return <Navigate to="/invoices" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Invoice {invoice.number}</h2>

        <Button
          variant="outline"
          onClick={() =>
            window.open(router.buildLocation({ to: "/invoices/$id/preview", params: { id } }).url, "_blank")
          }
        >
          <PrinterIcon />
          Print
        </Button>
      </div>

      <InvoiceForm defaultValues={invoice} submitButtonText="Save Invoice Changes" onSubmit={onSubmit} />
    </div>
  );
}
