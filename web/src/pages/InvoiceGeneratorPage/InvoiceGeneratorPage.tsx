import { Form, SubmitHandler } from '@redwoodjs/forms'
import { Metadata } from '@redwoodjs/web'

import { Card, CardContent, CardHeader, CardTitle } from 'src/components/ui/card'
import { FormField, FormInput } from 'src/components/ui/form'

type FormValues = {
  number: string
  issueDate: string
  dueDate: string
  paymentType: string
  seller: {
    name: string
    address: string
    postalCode: string
    city: string
    companyNumber: string
  }
  buyer: {
    name: string
    address: string
    postalCode: string
    city: string
    companyNumber: string
  }
  items: {
    name: string
    quantity: number
    rate: number
    taxPercentage: number
  }[]
}

const InvoiceGeneratorPage = () => {
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data)
  }

  return (
    <>
      <Metadata title="Invoice Generator" />

      <Form onSubmit={onSubmit} className="grid grid-cols-2 gap-8">
        <Card className="col-span-2">
          <CardContent className="space-y-2">
            <FormField name="number" label="Invoice Number">
              <FormInput name="number" validation={{ required: true }} />
            </FormField>
            <FormField name="issueDate" label="Issue Date">
              <FormInput name="issueDate" type="date" validation={{ required: true }} />
            </FormField>
            <FormField name="dueDate" label="Due Date">
              <FormInput name="dueDate" type="date" validation={{ required: true }} />
            </FormField>
            <FormField name="paymentType" label="Payment Type">
              <FormInput name="paymentType" validation={{ required: true }} />
            </FormField>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader className="pb-2">
            <CardTitle>Seller</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <FormField name="seller.name" label="Name">
              <FormInput name="seller.name" validation={{ required: true }} />
            </FormField>
            <FormField name="seller.address" label="Address">
              <FormInput name="seller.address" validation={{ required: true }} />
            </FormField>
            <FormField name="seller.postalCode" label="Postal Code">
              <FormInput name="seller.postalCode" validation={{ required: true }} />
            </FormField>
            <FormField name="seller.city" label="City">
              <FormInput name="seller.city" validation={{ required: true }} />
            </FormField>
            <FormField name="seller.companyNumber" label="Company Number">
              <FormInput name="seller.companyNumber" validation={{ required: true }} />
            </FormField>
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader className="pb-2">
            <CardTitle>Buyer</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <FormField name="buyer.name" label="Name">
              <FormInput name="buyer.name" validation={{ required: true }} />
            </FormField>
            <FormField name="buyer.address" label="Address">
              <FormInput name="buyer.address" validation={{ required: true }} />
            </FormField>
            <FormField name="buyer.postalCode" label="Postal Code">
              <FormInput name="buyer.postalCode" validation={{ required: true }} />
            </FormField>
            <FormField name="buyer.city" label="City">
              <FormInput name="buyer.city" validation={{ required: true }} />
            </FormField>
            <FormField name="buyer.companyNumber" label="Company Number">
              <FormInput name="buyer.companyNumber" validation={{ required: true }} />
            </FormField>
          </CardContent>
        </Card>

        <Card className="col-span-2 p-4">
          <CardHeader className="pb-2">
            <CardTitle>Items</CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            <FormField name="items.0.name" label="Name">
              <FormInput name="items.0.name" validation={{ required: true }} />
            </FormField>
            <FormField name="items.0.quantity" label="Quantity">
              <FormInput name="items.0.quantity" type="number" validation={{ required: true }} />
            </FormField>
            <FormField name="items.0.rate" label="Rate">
              <FormInput name="items.0.rate" type="number" validation={{ required: true }} />
            </FormField>
            <FormField name="items.0.taxPercentage" label="Tax %">
              <FormInput name="items.0.taxPercentage" type="number" validation={{ required: true }} />
            </FormField>
          </CardContent>
        </Card>

        <button type="submit" className="hidden"></button>
      </Form>
    </>
  )
}

export default InvoiceGeneratorPage
