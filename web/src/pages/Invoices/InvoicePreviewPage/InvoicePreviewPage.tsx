import { useEffect } from 'react'

import { useLocalStorage } from '@uidotdev/usehooks'

import { Metadata } from '@redwoodjs/web'

import { Separator } from 'src/components/ui/separator'

import { Invoice } from '../NewInvoicePage/NewInvoicePage'

type InvoicePreviewProps = {
  id: string
}

const InvoicePreviewPage = ({ id }: InvoicePreviewProps) => {
  const [invoices] = useLocalStorage<Invoice[]>('invoices', [])

  const invoice = invoices.find((invoice) => invoice.id === id)

  useEffect(() => {
    window.print()
  }, [])

  return invoice ? (
    <>
      <Metadata title="Invoice Preview" />

      <div className="mx-auto flex min-h-dvh max-w-screen-lg flex-col justify-between bg-white p-8 text-sm print:max-w-full print:p-0">
        <div className="space-y-8">
          <section className="flex justify-between">
            <div>
              <h2 className="text-3xl font-bold">INVOICE</h2>
              <p className="text-base">
                No. <span className="font-semibold text-black">{invoice.number}</span>
              </p>
            </div>

            <div className="text-right">
              <p>Issue date: {invoice.issueDate}</p>
              {invoice.saleDate ? <p>Sale date: {invoice.saleDate}</p> : null}
              <p>Due date: {invoice.dueDate}</p>
            </div>
          </section>

          <Separator />

          <section className="grid grid-cols-2 gap-12">
            <div className="space-y-2">
              <h3 className="text-base font-bold">Seller</h3>

              <div className="space-y-2">
                <p className="text-base font-semibold">{invoice.seller.name}</p>
                <p className="whitespace-pre-line">{invoice.seller.address}</p>
                <p>VAT No.: {invoice.seller.vatId}</p>
                <div>
                  <p>Payment type: {invoice.paymentType}</p>
                  <p>Bank: {invoice.paymentDetails.bankName}</p>
                  <p>IBAN: {invoice.paymentDetails.iban}</p>
                  <p>SWIFT: {invoice.paymentDetails.swift}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold">Buyer</h3>

              <div className="space-y-2">
                <p className="text-base font-semibold">{invoice.buyer.name}</p>
                <p className="whitespace-pre-line">{invoice.buyer.address}</p>
                <p>VAT No.: {invoice.buyer.vatId}</p>
              </div>
            </div>
          </section>

          <table className="w-full">
            <thead>
              <tr className="border-y *:py-2 *:font-semibold">
                <th className="text-left">Item description</th>
                <th className="w-1/6 text-right">Quantity</th>
                <th className="w-1/6 text-right">Unit price {invoice.conversion ? `(${invoice.currency})` : ''}</th>
                <th className="w-1/6 text-right">Price {invoice.conversion ? `(${invoice.currency})` : ''}</th>
              </tr>
            </thead>

            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.name} className="*:py-2">
                  <td className="text-left">{item.name}</td>
                  <td className="text-right">
                    {item.quantity} {item.unit}
                  </td>
                  <td className="text-right">
                    {new Intl.NumberFormat('en-UK', { minimumFractionDigits: 2 }).format(item.unitPrice)}
                  </td>
                  <td className="text-right">
                    {new Intl.NumberFormat('en-UK', { minimumFractionDigits: 2 }).format(item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {invoice.conversion ? (
            <section className="flex justify-end">
              <table className="w-72">
                <thead>
                  <tr className="border-y *:py-2 *:font-semibold">
                    <th className="text-left">Currency</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="*:py-2">
                    <td className="text-left">{invoice.currency}</td>
                    <td className="text-right">
                      {new Intl.NumberFormat('en-UK', { minimumFractionDigits: 2 }).format(invoice.total)}
                    </td>
                  </tr>

                  <tr className="*:py-2">
                    <td className="text-left">{invoice.conversion.currency}</td>
                    <td className="text-right">
                      {new Intl.NumberFormat('en-UK', { minimumFractionDigits: 2 }).format(
                        invoice.total * invoice.conversion.rate
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          ) : (
            <section className="flex justify-end">
              <div className="w-72 space-y-2">
                <Separator />

                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat('en-UK', { style: 'currency', currency: invoice.currency }).format(
                      invoice.total
                    )}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span>Paid:</span>
                  <span>
                    {new Intl.NumberFormat('en-UK', { style: 'currency', currency: invoice.currency }).format(0)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Due:</span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat('en-UK', { style: 'currency', currency: invoice.currency }).format(
                      invoice.total
                    )}
                  </span>
                </div>
              </div>
            </section>
          )}

          {invoice.conversion ? (
            <>
              <Separator />

              <section>
                <p>
                  Exchange rate 1 {invoice.currency} = {invoice.conversion.rate} {invoice.conversion.currency} (Table{' '}
                  {invoice.conversion.table} date {invoice.conversion.date})
                </p>
                <p>
                  Total:{' '}
                  {new Intl.NumberFormat('en-UK', { style: 'currency', currency: invoice.currency }).format(
                    invoice.total
                  )}{' '}
                  (
                  {new Intl.NumberFormat('en-UK', {
                    style: 'currency',
                    currency: invoice.conversion.currency,
                  }).format(invoice.total * invoice.conversion.rate)}
                  )
                </p>
                <p>
                  Paid: {new Intl.NumberFormat('en-UK', { style: 'currency', currency: invoice.currency }).format(0)} (
                  {new Intl.NumberFormat('en-UK', {
                    style: 'currency',
                    currency: invoice.conversion.currency,
                  }).format(0)}
                  )
                </p>
                <p>
                  Due:{' '}
                  {new Intl.NumberFormat('en-UK', { style: 'currency', currency: invoice.currency }).format(
                    invoice.total
                  )}{' '}
                  (
                  {new Intl.NumberFormat('en-UK', {
                    style: 'currency',
                    currency: invoice.conversion.currency,
                  }).format(invoice.total * invoice.conversion.rate)}
                  )
                </p>
              </section>
            </>
          ) : null}
        </div>

        <footer className="text-center">{invoice.footer}</footer>
      </div>
    </>
  ) : null
}

export default InvoicePreviewPage
