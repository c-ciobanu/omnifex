import { useLocalStorage } from '@uidotdev/usehooks'

import { Form, Submit, SubmitHandler } from '@redwoodjs/forms'
import { navigate, routes, useParams } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import InvoiceForm, { invoiceFormDefaultValues, InvoiceFormValues } from 'src/components/InvoiceForm/InvoiceForm'
import { buttonVariants } from 'src/components/ui/button'
import { cn } from 'src/lib/utils'

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

        <Submit className={cn(buttonVariants(), 'w-full')}>Create Invoice</Submit>
      </Form>
    </>
  )
}

export default NewInvoicePage
