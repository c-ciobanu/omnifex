import { useLocalStorage } from '@uidotdev/usehooks'

import { Form, Submit, SubmitHandler } from '@redwoodjs/forms'
import { routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import InvoiceForm, { InvoiceFormValues } from 'src/components/InvoiceForm/InvoiceForm'
import { buttonVariants } from 'src/components/ui/button'
import { cn } from 'src/lib/utils'

import { Invoice } from '../NewInvoicePage/NewInvoicePage'

type InvoicePageProps = {
  id: string
}

const InvoicePage = ({ id }: InvoicePageProps) => {
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', [])
  const invoice = invoices.find((i) => i.id === id)

  const onSubmit: SubmitHandler<InvoiceFormValues> = (data) => {
    const total = data.items.reduce((a, item) => a + item.price, 0)
    const conversion = data.conversion.currency ? data.conversion : undefined

    const invoice = { ...data, id, total, conversion }

    setInvoices((state) => state.map((i) => (i.id === id ? invoice : i)))

    window.open(routes.invoicePreview({ id }), '_black')
  }

  return (
    <>
      <Metadata title={`Invoice ${invoice.number}`} />

      <Form<InvoiceFormValues> config={{ defaultValues: invoice }} onSubmit={onSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">Invoice {invoice.number}</h2>

        <InvoiceForm />

        <Submit className={cn(buttonVariants(), 'w-full')}>Save Invoice and Preview</Submit>
      </Form>
    </>
  )
}

export default InvoicePage
