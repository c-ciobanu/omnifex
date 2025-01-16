import { useLocalStorage } from '@uidotdev/usehooks'
import { MoreVertical, Plus } from 'lucide-react'

import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'

import { Invoice } from '../NewInvoicePage/NewInvoicePage'

const InvoicesPage = () => {
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', [])

  return (
    <>
      <Metadata title="Invoices" />

      <div className="mb-4 flex justify-end">
        <Button asChild>
          <Link to={routes.newInvoice()} title="New Invoice">
            <Plus /> New Invoice
          </Link>
        </Button>
      </div>

      <ul className="divide-y divide-white">
        {invoices.map((invoice) => (
          <li key={invoice.id} className="flex items-center justify-between gap-6 py-4">
            <p className="text-sm font-medium">{invoice.number}</p>

            <div className="flex shrink-0 items-center gap-4">
              <Button asChild variant="outline">
                <Link to={routes.invoicePreview({ id: invoice.id })} title={invoice.number}>
                  View Invoice
                </Link>
              </Button>

              <DropdownMenu>
                <Button asChild variant="ghost" size="icon">
                  <DropdownMenuTrigger>
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                </Button>

                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(routes.newInvoice({ copy: invoice.id }))}>
                    Add Next
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open(routes.invoicePreview({ id: invoice.id }), '_black')}>
                    Print
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setInvoices((state) => state.filter((el) => el.id !== invoice.id))}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default InvoicesPage
