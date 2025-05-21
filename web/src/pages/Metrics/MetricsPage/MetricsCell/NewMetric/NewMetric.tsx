import { useState } from 'react'

import { Plus } from 'lucide-react'
import { CreateMetricMutation, CreateMetricMutationVariables } from 'types/graphql'

import { SubmitHandler } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import { Form, FormSubmit } from 'src/components/form'
import { FormInput } from 'src/components/form/elements'
import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/dialog'

import { QUERY } from '../MetricsCell'

interface FormValues {
  name: string
  unit?: string
  entry: { value: number; date: string }
}

const CREATE_METRIC = gql`
  mutation CreateMetricMutation($input: CreateMetricInput!) {
    createMetric(input: $input) {
      id
      name
      unit
      latestEntry {
        id
        value
        date
      }
    }
  }
`

const NewMetric = () => {
  const [isOpen, setIsOpen] = useState(false)

  const [createMetric, { loading }] = useMutation<CreateMetricMutation, CreateMetricMutationVariables>(CREATE_METRIC, {
    onCompleted: () => {
      setIsOpen(false)
    },
    update(cache, { data: { createMetric } }) {
      const data = cache.readQuery({ query: QUERY })

      cache.writeQuery({
        query: QUERY,
        data: { ...data, metrics: data.metrics.concat([createMetric]) },
      })
    },
  })

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    createMetric({ variables: { input: data } })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> New Metric
        </Button>
      </DialogTrigger>

      <DialogContent>
        <Form onSubmit={onSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>New Metric</DialogTitle>
          </DialogHeader>

          <FormInput name="name" label="Name" validation={{ required: true }} />

          <FormInput name="unit" label="Unit" />

          <FormInput
            name="entry.value"
            type="number"
            label="Entry Value"
            validation={{ required: true, valueAsNumber: true }}
            step="any"
          />

          <FormInput
            name="entry.date"
            type="date"
            label="Entry Date"
            defaultValue={new Date().toISOString().substring(0, 10)}
            max={new Date().toISOString().substring(0, 10)}
            validation={{ required: true, setValueAs: (s) => s }}
          />

          <DialogFooter>
            <DialogClose>Close</DialogClose>

            <FormSubmit disabled={loading} className="w-auto">
              Save
            </FormSubmit>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewMetric
