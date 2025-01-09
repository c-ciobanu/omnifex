import { useEffect } from 'react'

import { useLocalStorage } from '@uidotdev/usehooks'
import { PlusCircle, Trash2 } from 'lucide-react'

import { Form, SubmitHandler, useFieldArray, UseFieldArrayRemove, useForm, UseFormReturn } from '@redwoodjs/forms'
import { routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { FormCombobox, FormInput, FormTextarea } from 'src/components/form/elements'
import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardHeader } from 'src/components/ui/card'
import { Separator } from 'src/components/ui/separator'

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
    vatId: string
  }
  buyer: {
    name: string
    address: string
    vatId: string
  }
  items: {
    name: string
    quantity: number
    unit?: string
    unitPrice: number
    price: number
  }[]
  footer?: string
}

export type Invoice = FormValues & {
  id: string
  total: number
}

const defaultValues = {
  issueDate: new Date().toISOString().substring(0, 10),
  dueDate: new Date().toISOString().substring(0, 10),
  items: [{ quantity: 1, unitPrice: 0 }],
}

interface ItemProps {
  number: number
  formMethods: UseFormReturn<FormValues>
  onRemove: UseFieldArrayRemove
}

const Item = ({ number, formMethods, onRemove }: ItemProps) => {
  const item = formMethods.watch(`items.${number}`)

  useEffect(() => {
    formMethods.setValue(`items.${number}.price`, item.quantity * item.unitPrice)
  }, [item.quantity, item.unitPrice])

  return (
    <tr key={`item-${number}`} className="*:px-4 *:py-2">
      <td>
        <FormInput name={`items.${number}.name`} validation={{ required: true }} placeholder="Item description" />
      </td>
      <td>
        <FormInput name={`items.${number}.quantity`} type="number" min={0} validation={{ required: true }} />
      </td>
      <td>
        <FormInput name={`items.${number}.unit`} placeholder="hrs" />
      </td>
      <td>
        <FormInput name={`items.${number}.unitPrice`} type="number" min={0} validation={{ required: true }} />
      </td>
      <td>{new Intl.NumberFormat('en-UK', { minimumFractionDigits: 2 }).format(item.price)}</td>
      <td>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(number)}
          className="text-gray-500 hover:text-red-600"
        >
          <Trash2 />
          <span className="sr-only">Remove item</span>
        </Button>
      </td>
    </tr>
  )
}

const NewInvoicePage = () => {
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', [])
  const formMethods = useForm<FormValues>({ defaultValues })

  const items = formMethods.watch('items')
  const currency = formMethods.watch('currency')
  const total = new Intl.NumberFormat(
    'en-UK',
    currency ? { style: 'currency', currency: currency } : { minimumFractionDigits: 2 }
  ).format(items.reduce((a, item) => a + item.price, 0))

  const {
    fields: itemsFields,
    append: itemsAppend,
    remove: itemsRemove,
  } = useFieldArray({ control: formMethods.control, name: 'items' })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const invoiceId = (Number(invoices[invoices.length - 1]?.id ?? '0') + 1).toString()
    const total = items.reduce((a, item) => a + item.price, 0)

    const invoice = { ...data, id: invoiceId, total }

    setInvoices((state) => state.concat([invoice]))

    window.open(routes.invoicePreview({ id: invoiceId }), '_black')
  }

  return (
    <>
      <Metadata title="New Invoice" />

      <Form formMethods={formMethods} onSubmit={onSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">New Invoice</h2>

        <Card className="max-w-full">
          <CardContent className="flex justify-between">
            <div className="w-80">
              <FormInput name="number" validation={{ required: true }} label="Invoice number" />
            </div>

            <fieldset className="w-80 space-y-2">
              <FormInput
                name="issueDate"
                type="date"
                validation={{ required: true, setValueAs: (s) => s }}
                label="Issue date"
              />
              <FormInput
                name="dueDate"
                type="date"
                validation={{ required: true, setValueAs: (s) => s }}
                label="Due date"
              />
            </fieldset>
          </CardContent>
        </Card>

        <div className="flex justify-between gap-6">
          <Card className="max-w-full">
            <CardHeader>From</CardHeader>

            <CardContent>
              <fieldset className="space-y-2">
                <FormInput name="seller.name" validation={{ required: true }} label="Company name" />
                <FormTextarea name="seller.address" validation={{ required: true }} label="Address" rows={3} />
                <FormInput name="seller.vatId" validation={{ required: true }} label="VAT number" />
              </fieldset>
            </CardContent>
          </Card>

          <Card className="max-w-full">
            <CardHeader>To</CardHeader>

            <CardContent>
              <fieldset className="space-y-2">
                <FormInput name="buyer.name" validation={{ required: true }} label="Company name" />
                <FormTextarea name="buyer.address" validation={{ required: true }} label="Address" rows={3} />
                <FormInput name="buyer.vatId" validation={{ required: true }} label="VAT number" />
              </fieldset>
            </CardContent>
          </Card>
        </div>

        <Card className="max-w-full">
          <CardHeader>Payment Details</CardHeader>

          <CardContent className="flex justify-between">
            <div className="w-80">
              <FormInput name="paymentType" validation={{ required: true }} label="Payment type" />

              <Separator className="my-6" />

              <fieldset className="space-y-2">
                <FormInput name="paymentDetails.bankName" validation={{ required: true }} label="Bank name" />
                <FormInput name="paymentDetails.iban" validation={{ required: true }} label="IBAN" />
                <FormInput name="paymentDetails.swift" validation={{ required: true }} label="SWIFT code" />
              </fieldset>
            </div>

            <fieldset className="w-80 space-y-2">
              <FormCombobox
                name="currency"
                options={Intl.supportedValuesOf('currency').map((e) => ({ value: e, label: e }))}
                validation={{ required: true }}
                label="Currency"
              />
            </fieldset>
          </CardContent>
        </Card>

        <Card className="max-w-full">
          <CardHeader className="flex-row items-center justify-between">
            <p>Items</p>
            <Button type="button" variant="outline" size="sm" onClick={() => itemsAppend(defaultValues.items[0])}>
              <PlusCircle />
              Add Item
            </Button>
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
                {itemsFields.map((item, index) => (
                  <Item key={item.id} number={index} formMethods={formMethods} onRemove={itemsRemove} />
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

        <Card className="max-w-full">
          <CardHeader>Additional Information</CardHeader>

          <CardContent>
            <FormInput name="footer" label="Additional notes (printed at the bottom of the page)" className="w-1/2" />
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
