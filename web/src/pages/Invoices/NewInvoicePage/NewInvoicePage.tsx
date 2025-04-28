import { useLocalStorage } from '@uidotdev/usehooks'

import { SubmitHandler } from '@redwoodjs/forms'
import { navigate, routes, useParams } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { Form, FormSubmit } from 'src/components/form'
import InvoiceForm, { invoiceFormDefaultValues, InvoiceFormValues } from 'src/components/InvoiceForm/InvoiceForm'

export type Invoice = InvoiceFormValues & {
  id: string
  total: number
}

const NewInvoicePage = () => {
  const { copy } = useParams()
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', [])

  const onSubmit: SubmitHandler<InvoiceFormValues> = (data) => {
    const id = (Number(invoices[invoices.length - 1]?.id ?? '0') + 1).toString()
    const total = data.items.reduce((a, item) => a + item.price, 0)
    const conversion = data.conversion.currency ? data.conversion : undefined

    const invoice = { ...data, id, total, conversion }

    setInvoices((state) => state.concat([invoice]))

    window.open(routes.invoicePreview({ id }), '_black')
    navigate(routes.invoice({ id }))
  }

  return (
    <>
      <Metadata title="New Invoice" />

      <Form<InvoiceFormValues>
        config={{ defaultValues: invoices.find((i) => i.id === copy) ?? invoiceFormDefaultValues }}
        onSubmit={onSubmit}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold tracking-tight">New Invoice</h2>

        <InvoiceForm />

        <FormSubmit>Create Invoice</FormSubmit>
      </Form>
    </>
  )
}

export default NewInvoicePage
