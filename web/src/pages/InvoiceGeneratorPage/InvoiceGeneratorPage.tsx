import { useMemo } from 'react'

import { Form, SubmitHandler, useForm } from '@redwoodjs/forms'
import { Metadata } from '@redwoodjs/web'

import { FormInput } from 'src/components/OldForm/OldForm'
import { Card, CardContent } from 'src/components/ui/card'

type FormValues = {
  number: string
  issueDate: string
  dueDate: string
  paymentType: string
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
}

type Invoice = Omit<FormValues, 'items'> & {
  items: (FormValues['items'][number] & { price: number })[]
  total: number
}

const defaultValues = {
  issueDate: new Date().toISOString().substring(0, 10),
  dueDate: new Date().toISOString().substring(0, 10),
  items: [{ quantity: 1, unitPrice: 0 }],
}

const InvoiceGeneratorPage = () => {
  const formMethods = useForm<FormValues>({ defaultValues })

  const items = formMethods.watch('items')
  const prices = useMemo(
    () => items.map((item) => item.quantity * item.unitPrice),
    [items[0].quantity, items[0].unitPrice]
  )

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const total = prices.reduce((a, b) => a + b, 0)
    const invoice = {
      ...data,
      items: data.items.map((item, index) => ({ ...item, price: prices[index] })),
      total,
    }

    console.log(invoice as Invoice)
  }

  return (
    <>
      <Metadata title="Invoice Generator" />

      <Form formMethods={formMethods} onSubmit={onSubmit}>
        <Card>
          <CardContent className="space-y-8">
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
                <p className="leading-10">Issued to</p>
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
                  <td>{prices[0]}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="grid w-2/6 grid-cols-2 *:pl-4">
                <p className="font-medium">Total</p>
                <p>{prices[0]}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Form>
    </>
  )
}

export default InvoiceGeneratorPage
