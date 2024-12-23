import { useMemo } from 'react'

import { useLocalStorage } from '@uidotdev/usehooks'

import { Form, SubmitHandler, useForm } from '@redwoodjs/forms'
import { routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { FormInput, FormCombobox } from 'src/components/form/elements'
import { Button } from 'src/components/ui/button'
import { Card, CardContent } from 'src/components/ui/card'

type FormValues = {
  number: string
  issueDate: string
  dueDate: string
  paymentType: string
  paymentDetails: {
    bankName: string
    iban: string
    swift: string
  }
  currency: string
  seller: {
    name: string
    address: string
    postcode: string
    city: string
    country: string
    vatId: string
  }
  buyer: {
    name: string
    address: string
    postcode: string
    city: string
    country: string
    vatId: string
  }
  items: {
    name: string
    quantity: number
    unitPrice: number
  }[]
  footer?: string
}

export type Invoice = Omit<FormValues, 'items'> & {
  id: string
  items: (FormValues['items'][number] & { price: number })[]
  total: number
}

const defaultValues = {
  issueDate: new Date().toISOString().substring(0, 10),
  dueDate: new Date().toISOString().substring(0, 10),
  items: [{ quantity: 1, unitPrice: 0 }],
}

const NewInvoicePage = () => {
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', [])
  const formMethods = useForm<FormValues>({ defaultValues })

  const items = formMethods.watch('items')
  const prices = useMemo(
    () => items.map((item) => item.quantity * item.unitPrice),
    [items[0].quantity, items[0].unitPrice]
  )

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const invoiceId = (Number(invoices[invoices.length - 1]?.id ?? '0') + 1).toString()

    const total = prices.reduce((a, b) => a + b, 0)
    const invoice = {
      id: invoiceId,
      ...data,
      items: data.items.map((item, index) => ({ ...item, price: prices[index] })),
      total,
    }

    setInvoices((state) => state.concat([invoice]))

    window.open(routes.invoicePreview({ id: invoiceId }), '_black')
  }

  return (
    <>
      <Metadata title="Invoice Generator" />

      <Form formMethods={formMethods} onSubmit={onSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-24">
            <div className="space-y-8">
              <div className="flex justify-end">
                <fieldset className="w-80 space-y-2">
                  <FormInput name="seller.name" validation={{ required: true }} placeholder="Company name" />
                  <FormInput name="seller.address" validation={{ required: true }} placeholder="Address" />
                  <div className="grid grid-cols-2 gap-2">
                    <FormInput name="seller.postcode" validation={{ required: true }} placeholder="Postcode" />
                    <FormInput name="seller.city" validation={{ required: true }} placeholder="City" />
                  </div>
                  <FormInput name="seller.country" validation={{ required: true }} placeholder="Country" />
                  <FormInput name="seller.vatId" validation={{ required: true }} placeholder="VAT number" />
                </fieldset>
              </div>

              <div className="flex items-center">
                <hr className="h-px w-full bg-gray-200" />
                <span className="absolute left-2/3 -translate-x-1/2 bg-white px-4">INVOICE</span>
              </div>

              <div className="flex justify-between">
                <fieldset className="w-80 space-y-2">
                  <p className="leading-9">Issued to</p>
                  <FormInput name="buyer.name" validation={{ required: true }} placeholder="Company name" />
                  <FormInput name="buyer.address" validation={{ required: true }} placeholder="Address" />
                  <div className="grid grid-cols-2 gap-2">
                    <FormInput name="buyer.postcode" validation={{ required: true }} placeholder="Postcode" />
                    <FormInput name="buyer.city" validation={{ required: true }} placeholder="City" />
                  </div>
                  <FormInput name="buyer.country" validation={{ required: true }} placeholder="Country" />
                  <FormInput name="buyer.vatId" validation={{ required: true }} placeholder="VAT number" />
                </fieldset>

                <fieldset className="grid grid-cols-[auto_20rem] content-start items-center gap-2">
                  <p></p>
                  <FormInput name="number" validation={{ required: true }} placeholder="Invoice number" />
                  <p>Issue date</p>
                  <FormInput name="issueDate" type="date" validation={{ required: true, setValueAs: (s) => s }} />
                  <p>Due date</p>
                  <FormInput name="dueDate" type="date" validation={{ required: true, setValueAs: (s) => s }} />
                  <p></p>
                  <FormInput name="paymentType" validation={{ required: true }} placeholder="Payment type" />
                </fieldset>
              </div>

              <table>
                <thead className="bg-yellow-100">
                  <tr className="*:px-4 *:py-2 *:text-left *:font-medium">
                    <th className="w-1/2">Item</th>
                    <th className="w-1/6">Quantity</th>
                    <th className="w-1/6">Unit price</th>
                    <th className="w-1/6">Price</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="*:px-4 *:py-2">
                    <td>
                      <FormInput name="items.0.name" validation={{ required: true }} placeholder="Item description" />
                    </td>
                    <td>
                      <FormInput name="items.0.quantity" type="number" min={0} validation={{ required: true }} />
                    </td>
                    <td>
                      <FormInput name="items.0.unitPrice" type="number" min={0} validation={{ required: true }} />
                    </td>
                    <td>{new Intl.NumberFormat('en-UK', { minimumFractionDigits: 2 }).format(prices[0])}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-end">
                <div className="grid w-2/6 grid-cols-2 *:pl-4">
                  <p className="font-medium">Total</p>
                  <p>
                    {new Intl.NumberFormat(
                      'en-UK',
                      formMethods.watch('currency')
                        ? { style: 'currency', currency: formMethods.watch('currency') }
                        : { minimumFractionDigits: 2 }
                    ).format(prices[0])}
                  </p>
                </div>
              </div>

              <div className="flex justify-between">
                <fieldset className="w-80 space-y-2">
                  <p className="leading-9">Payment Details</p>
                  <FormInput name="paymentDetails.bankName" validation={{ required: true }} placeholder="Bank name" />
                  <FormInput name="paymentDetails.iban" validation={{ required: true }} placeholder="IBAN" />
                  <FormInput name="paymentDetails.swift" validation={{ required: true }} placeholder="SWIFT code" />
                </fieldset>

                <fieldset className="grid grid-cols-[auto_20rem] content-start items-center gap-2">
                  <p>Currency</p>
                  <FormCombobox
                    name={`currency`}
                    options={Intl.supportedValuesOf('currency').map((e) => ({ value: e, label: e }))}
                    validation={{ required: true }}
                  />
                </fieldset>
              </div>
            </div>

            <div className="mt-24 flex justify-center">
              <FormInput name="footer" placeholder="Additional notes" className="w-1/2" />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full" disabled={formMethods.formState.isSubmitting}>
          Save Invoice and Preview
        </Button>
      </Form>
    </>
  )
}

export default NewInvoicePage
