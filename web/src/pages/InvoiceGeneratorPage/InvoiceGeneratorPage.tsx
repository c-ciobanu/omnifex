import { useState } from 'react'

import { Form, SubmitHandler } from '@redwoodjs/forms'
import { Metadata } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card'
import { FormField, FormInput } from 'src/components/ui/form'

type FormValues = {
  number: string
  issueDate: string
  dueDate: string
  paymentType: string
  taxPercentage?: number
  seller: {
    name: string
    address: string
    postalCode: string
    city: string
    taxId: string
  }
  buyer: {
    name: string
    address: string
    postalCode: string
    city: string
    taxId: string
  }
  items: {
    name: string
    quantity: number
    unitPrice: number
  }[]
}

type Invoice = Omit<FormValues, 'items'> & {
  items: (FormValues['items'][number] & { total: number })[]
  subtotal: number
  tax: number
  total: number
}

const InvoiceGeneratorPage = () => {
  const [invoice, setInvoice] = useState<Invoice>()

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const totals = data.items.map((item) => item.unitPrice * item.quantity)
    const subtotal = totals.reduce((a, b) => a + b, 0)
    const tax = data.taxPercentage ? subtotal * 100 * data.taxPercentage : 0
    const total = subtotal + tax

    setInvoice({
      ...data,
      items: data.items.map((item, index) => ({ ...item, total: totals[index] })),
      subtotal,
      tax,
      total,
    })
  }

  return (
    <>
      <Metadata title="Invoice Generator" />

      <Form onSubmit={onSubmit} className="grid grid-cols-2 gap-8">
        <Card className="col-span-2 p-4">
          <CardContent className="space-y-2">
            <FormField name="number" label="Invoice Number">
              <FormInput name="number" validation={{ required: true }} />
            </FormField>
            <FormField name="issueDate" label="Issue Date">
              <FormInput name="issueDate" type="date" validation={{ required: true, setValueAs: (s) => s }} />
            </FormField>
            <FormField name="dueDate" label="Due Date">
              <FormInput name="dueDate" type="date" validation={{ required: true, setValueAs: (s) => s }} />
            </FormField>
            <FormField name="paymentType" label="Payment Type">
              <FormInput name="paymentType" validation={{ required: true }} />
            </FormField>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader className="pb-2">
            <CardTitle>Seller</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <FormField name="seller.name" label="Name">
              <FormInput name="seller.name" validation={{ required: true }} />
            </FormField>
            <FormField name="seller.address" label="Address">
              <FormInput name="seller.address" validation={{ required: true }} />
            </FormField>
            <FormField name="seller.postalCode" label="Postal Code">
              <FormInput name="seller.postalCode" validation={{ required: true }} />
            </FormField>
            <FormField name="seller.city" label="City">
              <FormInput name="seller.city" validation={{ required: true }} />
            </FormField>
            <FormField name="seller.taxId" label="Tax ID">
              <FormInput name="seller.taxId" validation={{ required: true }} />
            </FormField>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader className="pb-2">
            <CardTitle>Buyer</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <FormField name="buyer.name" label="Name">
              <FormInput name="buyer.name" validation={{ required: true }} />
            </FormField>
            <FormField name="buyer.address" label="Address">
              <FormInput name="buyer.address" validation={{ required: true }} />
            </FormField>
            <FormField name="buyer.postalCode" label="Postal Code">
              <FormInput name="buyer.postalCode" validation={{ required: true }} />
            </FormField>
            <FormField name="buyer.city" label="City">
              <FormInput name="buyer.city" validation={{ required: true }} />
            </FormField>
            <FormField name="buyer.taxId" label="Tax ID">
              <FormInput name="buyer.taxId" validation={{ required: true }} />
            </FormField>
          </CardContent>
        </Card>

        <Card className="col-span-2 p-4">
          <CardHeader className="pb-2">
            <CardTitle>Items</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <FormField name="taxPercentage" label="Tax %">
              <FormInput name="taxPercentage" type="number" emptyAs="undefined" min={0} max={100} />
            </FormField>

            <div className="grid grid-cols-3 gap-4">
              <FormField name="items.0.name" label="Name">
                <FormInput name="items.0.name" validation={{ required: true }} />
              </FormField>
              <FormField name="items.0.quantity" label="Quantity">
                <FormInput name="items.0.quantity" type="number" min={0} validation={{ required: true }} />
              </FormField>
              <FormField name="items.0.unitPrice" label="Unit Price">
                <FormInput name="items.0.unitPrice" type="number" min={0} validation={{ required: true }} />
              </FormField>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="col-span-2 justify-self-end">
          Preview
        </Button>
      </Form>

      {invoice ? (
        <Card className="mt-8 p-4">
          <CardContent className="space-y-4">
            <div className="grid w-fit grid-cols-2 gap-x-8 gap-y-2">
              <div className="col-span-2 mb-4 grid grid-cols-2 gap-x-8">
                <p className="font-medium">Invoice #</p>
                <p>{invoice.number}</p>
              </div>

              <p className="font-medium">Issue date</p>
              <p>{invoice.issueDate}</p>
              <p className="font-medium">Due date</p>
              <p>{invoice.dueDate}</p>
              <p className="font-medium">Payment type</p>
              <p>{invoice.paymentType}</p>
            </div>

            <div className="grid grid-cols-2">
              <div>
                <h4 className="font-medium">Seller</h4>

                <p>{invoice.seller.name}</p>
                <p>{invoice.seller.address}</p>
                <p>
                  {invoice.seller.postalCode} {invoice.seller.city}
                </p>
                <p>{invoice.seller.taxId}</p>
              </div>

              <div>
                <h4 className="font-medium">Buyer</h4>

                <p>{invoice.buyer.name}</p>
                <p>{invoice.buyer.address}</p>
                <p>
                  {invoice.buyer.postalCode} {invoice.buyer.city}
                </p>
                <p>Tax ID {invoice.buyer.taxId}</p>
              </div>
            </div>

            <table className="w-full border-collapse border border-slate-400">
              <thead className="bg-slate-50">
                <tr className="*:border *:border-slate-300 *:p-4 *:text-left *:font-medium">
                  <th className="w-1/2">Item</th>
                  <th className="w-1/6">Quantity</th>
                  <th className="w-1/6">Unit price</th>
                  <th className="w-1/6">Amount</th>
                </tr>
              </thead>

              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.name} className="*:border *:border-slate-300 *:p-4">
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unitPrice}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="grid w-2/6 grid-cols-2 gap-y-4 *:pl-4">
                <p className="font-medium">Subtotal</p>
                <p>{invoice.subtotal}</p>
                {invoice.taxPercentage ? (
                  <>
                    <p className="font-medium">Tax ({invoice.taxPercentage}%)</p>
                    <p>{invoice.tax}</p>
                  </>
                ) : null}
                <p className="font-medium">Total</p>
                <p>{invoice.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </>
  )
}

export default InvoiceGeneratorPage
