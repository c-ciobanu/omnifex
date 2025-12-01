import { useAppForm } from "@/hooks/form";
import { zodTypes } from "@/lib/zod";
import { useStore } from "@tanstack/react-form";
import { PlusCircleIcon, Trash2Icon } from "lucide-react";
import * as z from "zod";

import { Button } from "./ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

const formSchema = z.object({
  number: z.string().min(1),
  issueDate: z.string().min(1),
  saleDate: zodTypes.optionalString,
  dueDate: z.string().min(1),
  paymentType: z.string().min(1),
  paymentDetails: z.object({
    bankName: z.string().min(1),
    iban: z.string().min(1),
    swift: z.string().min(1),
  }),
  currency: z.string().min(1),
  conversion: z
    .object({
      currency: z.string().min(1),
      rate: zodTypes.number,
      table: z.string().min(1),
      date: z.string().min(1),
    })
    .optional(),
  seller: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    vatId: z.string().min(1),
  }),
  buyer: z.object({
    name: z.string().min(1),
    address: z.string().min(1),
    vatId: z.string().min(1),
  }),
  items: z.array(
    z.object({
      name: z.string().min(1),
      quantity: zodTypes.number,
      unit: zodTypes.optionalString,
      unitPrice: zodTypes.number,
      price: zodTypes.number,
    }),
  ),
  footer: zodTypes.optionalString,
});

type InvoiceFormValues = z.infer<typeof formSchema>;

export type InvoiceFormSubmitValues = InvoiceFormValues & {
  total: number;
};

interface Props {
  submitButtonText: string;
  defaultValues?: InvoiceFormValues;
  onSubmit: (data: InvoiceFormSubmitValues) => void;
}

export function InvoiceForm({ submitButtonText, defaultValues, onSubmit }: Props) {
  const form = useAppForm({
    defaultValues: defaultValues ?? {
      number: "",
      issueDate: new Date().toISOString().substring(0, 10),
      saleDate: "",
      dueDate: new Date().toISOString().substring(0, 10),
      paymentType: "",
      paymentDetails: { bankName: "", iban: "", swift: "" },
      currency: "",
      // conversion: { currency: "", rate: 0, table: "", date: "" },
      seller: { name: "", address: "", vatId: "" },
      buyer: { name: "", address: "", vatId: "" },
      items: [{ name: "", quantity: 1, unit: "", unitPrice: 0, price: 0 }],
      footer: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: ({ value }) => {
      const data = formSchema.parse(value);

      const items = data.items.map((item) => ({ ...item, price: item.quantity * item.unitPrice }));
      const total = items.reduce((a, item) => a + item.price, 0);

      onSubmit({ ...data, items, total });
    },
  });

  const items = useStore(form.store, (state) => state.values.items);
  const currency = useStore(form.store, (state) => state.values.currency);
  const total = new Intl.NumberFormat(
    "en-UK",
    currency ? { style: "currency", currency: currency } : { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  ).format(items.reduce((a, item) => a + item.quantity * item.unitPrice, 0));

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        await form.handleSubmit();
      }}
      className="space-y-6"
    >
      <Card className="max-w-full">
        <CardContent className="flex justify-between">
          <div className="w-80">
            <form.AppField name="number" children={(field) => <field.InputField label="Invoice number" />} />
          </div>

          <fieldset className="w-80 space-y-2">
            <form.AppField
              name="issueDate"
              children={(field) => <field.InputField label="Issue date" inputProps={{ type: "date" }} />}
            />
            <form.AppField
              name="saleDate"
              children={(field) => <field.InputField label="Sale date" inputProps={{ type: "date" }} />}
            />
            <form.AppField
              name="dueDate"
              children={(field) => <field.InputField label="Due date" inputProps={{ type: "date" }} />}
            />
          </fieldset>
        </CardContent>
      </Card>

      <div className="flex justify-between gap-6">
        <Card className="w-full">
          <CardHeader>From</CardHeader>

          <CardContent>
            <fieldset className="space-y-2">
              <form.AppField name="seller.name" children={(field) => <field.InputField label="Company name" />} />
              <form.AppField name="seller.address" children={(field) => <field.TextareaField label="Address" />} />
              <form.AppField name="seller.vatId" children={(field) => <field.InputField label="VAT number" />} />
            </fieldset>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>To</CardHeader>

          <CardContent>
            <fieldset className="space-y-2">
              <form.AppField name="buyer.name" children={(field) => <field.InputField label="Company name" />} />
              <form.AppField name="buyer.address" children={(field) => <field.TextareaField label="Address" />} />
              <form.AppField name="buyer.vatId" children={(field) => <field.InputField label="VAT number" />} />
            </fieldset>
          </CardContent>
        </Card>
      </div>

      <Card className="max-w-full">
        <CardHeader>Payment Details</CardHeader>

        <CardContent className="flex justify-between">
          <div className="w-80">
            <form.AppField name="paymentType" children={(field) => <field.InputField label="Payment type" />} />

            <Separator className="my-6" />

            <fieldset className="space-y-2">
              <form.AppField
                name="paymentDetails.bankName"
                children={(field) => <field.InputField label="Bank name" />}
              />
              <form.AppField name="paymentDetails.iban" children={(field) => <field.InputField label="IBAN" />} />
              <form.AppField
                name="paymentDetails.swift"
                children={(field) => <field.InputField label="SWIFT code" />}
              />
            </fieldset>
          </div>

          <div className="w-80">
            <form.AppField
              name="currency"
              children={(field) => (
                <field.SelectField
                  label="Currency"
                  options={Intl.supportedValuesOf("currency").map((e) => ({ value: e, label: e }))}
                />
              )}
            />

            <Separator className="my-6" />

            <fieldset className="space-y-2">
              <form.AppField
                name="conversion.currency"
                children={(field) => (
                  <field.SelectField
                    label="Show converted prices in"
                    options={Intl.supportedValuesOf("currency").map((e) => ({ value: e, label: e }))}
                  />
                )}
              />
              <form.AppField
                name="conversion.rate"
                children={(field) => (
                  <field.InputField label="Exchange rate" inputProps={{ type: "number", min: 0, step: 0.0001 }} />
                )}
              />
              <form.AppField name="conversion.table" children={(field) => <field.InputField label="Table" />} />
              <form.AppField
                name="conversion.date"
                children={(field) => <field.InputField label="Date" inputProps={{ type: "date" }} />}
              />
            </fieldset>
          </div>
        </CardContent>
      </Card>

      <form.AppField name="items" mode="array">
        {(field) => (
          <Card className="max-w-full">
            <CardHeader>
              <CardTitle>Items</CardTitle>
              <CardAction>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => field.pushValue({ name: "", quantity: 1, unit: "", unitPrice: 0, price: 0 })}
                >
                  <PlusCircleIcon />
                  Add Item
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent>
              <table>
                <thead className="bg-yellow-100">
                  <tr className="*:px-4 *:py-2 *:text-left *:font-medium">
                    <th className="w-1/2">Item</th>
                    <th className="w-1/6">Quantity</th>
                    <th className="w-1/6">Quantity unit</th>
                    <th className="w-1/6">Unit price</th>
                    <th className="w-1/6">Price</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {field.state.value.map((item, index) => (
                    <tr key={index} className="*:px-4 *:py-2">
                      <td>
                        <form.AppField
                          name={`items[${index}].name`}
                          children={(field) => <field.InputField inputProps={{ placeholder: "Item description" }} />}
                        />
                      </td>
                      <td>
                        <form.AppField
                          name={`items[${index}].quantity`}
                          children={(field) => (
                            <field.InputField inputProps={{ type: "number", min: 0, step: "any" }} />
                          )}
                        />
                      </td>
                      <td>
                        <form.AppField
                          name={`items[${index}].unit`}
                          children={(field) => <field.InputField inputProps={{ placeholder: "hrs" }} />}
                        />
                      </td>
                      <td>
                        <form.AppField
                          name={`items[${index}].unitPrice`}
                          children={(field) => (
                            <field.InputField inputProps={{ type: "number", min: 0, step: "any" }} />
                          )}
                        />
                      </td>
                      <td>
                        {new Intl.NumberFormat("en-UK", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(item.quantity * item.unitPrice)}
                      </td>
                      <td>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => field.removeValue(index)}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2Icon />
                          <span className="sr-only">Remove item</span>
                        </Button>
                      </td>
                    </tr>
                  ))}

                  <tr className="*:px-4 *:py-2 *:pt-6">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="font-medium">Total</td>
                    <td>{total}</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </form.AppField>

      <Card className="max-w-full">
        <CardHeader>Additional Information</CardHeader>

        <CardContent>
          <form.AppField
            name="footer"
            children={(field) => (
              <field.InputField
                label="Additional notes (printed at the bottom of the page)"
                inputProps={{ className: "w-1/2" }}
                className="w-1/2"
              />
            )}
          />
        </CardContent>
      </Card>

      <form.AppForm>
        <form.SubmitButton className="w-full">{submitButtonText}</form.SubmitButton>
      </form.AppForm>
    </form>
  );
}
