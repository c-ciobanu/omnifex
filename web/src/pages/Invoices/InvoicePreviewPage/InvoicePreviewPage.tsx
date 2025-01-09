import { useEffect } from 'react'

import { useLocalStorage } from '@uidotdev/usehooks'

import { Metadata } from '@redwoodjs/web'

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

      <div className="mx-auto flex min-h-dvh max-w-screen-lg flex-col justify-between bg-white p-6 print:max-w-full print:p-0">
        <div className="space-y-8">
          <section className="flex justify-end">
            <div className="w-56 space-y-2">
              <p>{invoice.seller.name}</p>
              <p className="whitespace-pre-line">{invoice.seller.address}</p>
              <p>{invoice.seller.vatId}</p>
            </div>
          </section>

          <div className="relative flex items-center">
            <hr className="h-px w-full bg-gray-200" />
            <span className="absolute right-56 ml-4 translate-x-[calc(100%-16px)] bg-white px-4">INVOICE</span>
          </div>

          <div className="flex justify-between">
            <section className="w-56 space-y-2">
              <p className="font-bold leading-10">Issued to</p>
              <p>{invoice.buyer.name}</p>
              <p className="whitespace-pre-line">{invoice.buyer.address}</p>
              <p>{invoice.buyer.vatId}</p>
            </section>

            <section className="grid grid-cols-[auto_14rem] content-start items-center gap-2">
              <p className="font-bold">Invoice No.</p>
              <p>{invoice.number}</p>
              <p className="font-bold">Issue date</p>
              <p>{invoice.issueDate}</p>
              <p className="font-bold">Due date</p>
              <p>{invoice.dueDate}</p>
              <p className="font-bold">Payment type</p>
              <p>{invoice.paymentType}</p>
            </section>
          </div>

          <table className="w-full">
            <thead className="bg-yellow-100">
              <tr className="*:px-4 *:py-2 *:text-left *:font-medium">
                <th className="w-1/2">Item</th>
                <th className="w-1/6">Quantity</th>
                <th className="w-1/6">Unit price</th>
                <th className="w-1/6">Price</th>
              </tr>
            </thead>

            <tbody>
              {invoice.items.map((item) => (
                <tr key={item.name} className="*:px-4 *:py-2">
                  <td>{item.name}</td>
                  <td>
                    {item.quantity} {item.unit}
                  </td>
                  <td>{new Intl.NumberFormat('en-UK', { minimumFractionDigits: 2 }).format(item.unitPrice)}</td>
                  <td>{new Intl.NumberFormat('en-UK', { minimumFractionDigits: 2 }).format(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="grid w-2/6 grid-cols-2 gap-y-2 *:pl-4">
              <p className="font-medium">Total</p>
              <p>
                {new Intl.NumberFormat('en-UK', { style: 'currency', currency: invoice.currency }).format(
                  invoice.total
                )}
              </p>
              {invoice.secondaryCurrency ? (
                <>
                  <p></p>
                  <p>
                    {new Intl.NumberFormat('en-UK', {
                      style: 'currency',
                      currency: invoice.secondaryCurrency.name,
                    }).format(invoice.total * invoice.secondaryCurrency.exchangeRate)}
                  </p>
                </>
              ) : null}
            </div>
          </div>

          <section className="inline-grid grid-cols-[auto_14rem] content-start items-center gap-x-4">
            <p className="col-span-2 font-bold">Payment Details</p>
            <p className="font-bold">Bank</p>
            <p>{invoice.paymentDetails.bankName}</p>
            <p className="font-bold">IBAN</p>
            <p>{invoice.paymentDetails.iban}</p>
            <p className="font-bold">SWIFT</p>
            <p>{invoice.paymentDetails.swift}</p>
          </section>
        </div>

        <footer className="text-center">{invoice.footer}</footer>
      </div>
    </>
  ) : null
}

export default InvoicePreviewPage
