import type { MetricQuery, UpdateMetricEntryMutation, UpdateMetricEntryMutationVariables } from 'types/graphql'

import { SubmitHandler } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import { Form, FormSubmit } from 'src/components/form'
import { FormInput } from 'src/components/form/elements'
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

          <FormInput
            name="value"
            type="number"
            label={`Value [ ${metric.unit} ]`}
            defaultValue={metricEntry.value}
            validation={{ required: true, valueAsNumber: true }}
            step="any"
          />

          <FormInput
            name="date"
            type="date"
            label="Date"
            defaultValue={metricEntry.date}
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

export default EditMetricEntryModal
