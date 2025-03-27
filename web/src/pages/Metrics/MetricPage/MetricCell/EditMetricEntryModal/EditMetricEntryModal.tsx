import type { MetricQuery, UpdateMetricEntryMutation, UpdateMetricEntryMutationVariables } from 'types/graphql'

import { Form, SubmitHandler } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import { FormField, FormInput } from 'src/components/OldForm/OldForm'
import { Button } from 'src/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'src/components/ui/dialog'

const UPDATE_METRIC_ENTRY = gql`
  mutation UpdateMetricEntryMutation($id: Int!, $input: UpdateMetricEntryInput!) {
    updateMetricEntry(id: $id, input: $input) {
      id
      value
      date
    }
  }
`

interface FormValues {
  value: number
  date: string
}

type EditMetricEntryModalProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  metric: MetricQuery['metric']
  metricEntry: MetricQuery['metric']['entries'][number]
}

const EditMetricEntryModal = (props: EditMetricEntryModalProps) => {
  const { isOpen, setIsOpen, metric, metricEntry } = props

  const [updateMetricEntry, { loading }] = useMutation<UpdateMetricEntryMutation, UpdateMetricEntryMutationVariables>(
    UPDATE_METRIC_ENTRY,
    {
      onCompleted: () => {
        setIsOpen(false)
      },
    }
  )

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    updateMetricEntry({ variables: { id: metricEntry.id, input: data } })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <Form onSubmit={onSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Edit Metric Entry</DialogTitle>
          </DialogHeader>

          <FormField name="value" label={`Value [ ${metric.unit} ]`}>
            <FormInput
              name="value"
              type="number"
              defaultValue={metricEntry.value}
              validation={{ required: true }}
              step="any"
            />
          </FormField>

          <FormField name="date" label="Date">
            <FormInput
              name="date"
              type="date"
              defaultValue={metricEntry.date}
              max={new Date().toISOString().substring(0, 10)}
              validation={{ required: true, setValueAs: (s) => s }}
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

export default EditMetricEntryModal
