import type { InvoiceFormSubmitValues } from "@/components/invoice-form";
import { InvoiceForm } from "@/components/invoice-form";
import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useLocalStorage } from "usehooks-ts";
import * as z from "zod";

export interface Invoice extends InvoiceFormSubmitValues {
  id: string;
  total: number;
}

export const Route = createFileRoute("/invoices_/new")({
  validateSearch: z.object({
    copy: z.string().optional(),
  }),
  component: Component,
});

function Component() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();

  const [invoices, setInvoices] = useLocalStorage<Invoice[]>("invoices", []);

  const onSubmit = async (data: InvoiceFormSubmitValues) => {
    const newId = String(Number(invoices.at(-1)?.id ?? "0") + 1);

    const conversion = data.conversion?.currency ? data.conversion : undefined;

    const invoice = { ...data, conversion, id: newId };

    setInvoices((state) => state.concat([invoice]));

    window.open(router.buildLocation({ to: "/invoices/$id/preview", params: { id: newId } }).href, "_blank");
    await navigate({ to: "/invoices/$id", params: { id: newId } });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">New Invoice</h2>

      <InvoiceForm
        defaultValues={invoices.find((i) => i.id === search.copy)}
        submitButtonText="Create Invoice"
        onSubmit={onSubmit}
      />
    </div>
  );
}
