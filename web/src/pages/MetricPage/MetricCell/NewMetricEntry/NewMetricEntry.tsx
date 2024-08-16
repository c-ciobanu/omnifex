import { useState } from 'react'

import { Plus } from 'lucide-react'
import { CreateMetricEntryMutation, CreateMetricEntryMutationVariables, MetricQuery } from 'types/graphql'

import { DateField, FieldError, Form, Label, Submit, TextField } from '@redwoodjs/forms'
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

import { QUERY } from '../MetricCell'

const CREATE_METRIC_ENTRY = gql`
  mutation CreateMetricEntryMutation($input: CreateMetricEntryInput!) {
    createMetricEntry(input: $input) {
      id
    }
  }
`

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

  function onSubmit({ value, date }: { value: string; date: Date }) {
    createMetricEntry({
      variables: { input: { metricId: metric.id, value, date: date.toISOString().substring(0, 10) } },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Entry
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>New Entry</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <fieldset>
              <Label name="value" className="form-label" errorClassName="form-label form-label-error">
                Value [ {metric.unit} ]
              </Label>
              <TextField
                name="value"
                defaultValue={metric.entries[0].value}
                className="form-input"
                errorClassName="form-input form-input-error"
                validation={{ required: true }}
              />
              <FieldError name="value" className="form-field-error" />
            </fieldset>

            <fieldset>
              <Label name="date" className="form-label" errorClassName="form-label form-label-error">
                Date
              </Label>
              <DateField
                name="date"
                defaultValue={new Date().toISOString().substring(0, 10)}
                className="form-input"
                errorClassName="form-input form-input-error"
                validation={{ required: true }}
              />
              <FieldError name="date" className="form-field-error" />
            </fieldset>
          </div>

          <DialogFooter className="gap-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>

            <Button asChild>
              <Submit disabled={loading}>Save</Submit>
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default NewMetricEntry
