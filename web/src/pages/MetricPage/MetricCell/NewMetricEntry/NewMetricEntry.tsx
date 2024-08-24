import { useState } from 'react'

import { Plus } from 'lucide-react'
import { CreateMetricEntryMutation, CreateMetricEntryMutationVariables, MetricQuery } from 'types/graphql'

import { Form, SubmitHandler } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

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
import { FormField, FormInput } from 'src/components/ui/form'

import { QUERY } from '../MetricCell'

const CREATE_METRIC_ENTRY = gql`
  mutation CreateMetricEntryMutation($input: CreateMetricEntryInput!) {
    createMetricEntry(input: $input) {
      id
    }
  }
`

interface FormValues {
  value: string
  date: string
}

type NewMetricEntryProps = {
  metric: MetricQuery['metric']
}

const NewMetricEntry = (props: NewMetricEntryProps) => {
  const { metric } = props
  const [isOpen, setIsOpen] = useState(false)

  const [createMetricEntry, { loading }] = useMutation<CreateMetricEntryMutation, CreateMetricEntryMutationVariables>(
    CREATE_METRIC_ENTRY,
    {
      onCompleted: () => {
        setIsOpen(false)
      },
      refetchQueries: [{ query: QUERY, variables: { id: metric.id } }],
    }
  )

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    createMetricEntry({ variables: { input: { metricId: metric.id, ...data } } })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Entry
        </Button>
      </DialogTrigger>

      <DialogContent>
        <Form onSubmit={onSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>New Entry</DialogTitle>
          </DialogHeader>

          <FormField name="value" label={`Value [ ${metric.unit} ]`}>
            <FormInput name="value" defaultValue={metric.entries[0].value} validation={{ required: true }} />
          </FormField>

          <FormField name="date" label="Date">
            <FormInput
              name="date"
              type="date"
              defaultValue={new Date().toISOString().substring(0, 10)}
              max={new Date().toISOString().substring(0, 10)}
              validation={{ required: true }}
            />
          </FormField>

          <DialogFooter>
            <DialogClose>Close</DialogClose>

            <Button type="submit" disabled={loading}>
              Save
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewMetricEntry
