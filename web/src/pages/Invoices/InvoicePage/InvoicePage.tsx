import { useLocalStorage } from '@uidotdev/usehooks'
import { Printer } from 'lucide-react'

import { SubmitHandler } from '@redwoodjs/forms'
import { routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { Form, FormSubmit } from 'src/components/form'
import InvoiceForm, { InvoiceFormValues } from 'src/components/InvoiceForm/InvoiceForm'
import { Button } from 'src/components/ui/button'

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

    const updatedInvoice = { ...data, id, total, conversion }

    setInvoices((state) => state.map((i) => (i.id === id ? updatedInvoice : i)))
  }

  return (
    <>
      <Metadata title={`Invoice ${invoice.number}`} />

      <Form<InvoiceFormValues> config={{ defaultValues: invoice }} onSubmit={onSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Invoice {invoice.number}</h2>

          <Button variant="outline" onClick={() => window.open(routes.invoicePreview({ id }), '_black')}>
            <Printer />
            Print
          </Button>
        </div>

        <InvoiceForm />

        <FormSubmit>Save Invoice Changes</FormSubmit>
      </Form>
    </>
  )
}

export default InvoicePage
