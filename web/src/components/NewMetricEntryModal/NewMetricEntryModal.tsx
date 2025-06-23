import { CreateMetricEntryMutation, CreateMetricEntryMutationVariables, Metric, MetricEntry } from 'types/graphql'

import { SubmitHandler } from '@cedarjs/forms'
import { useMutation } from '@cedarjs/web'

import { Form, FormSubmit } from 'src/components/form'
import { FormInput } from 'src/components/form/elements'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'src/components/ui/dialog'

export const CREATE_METRIC_ENTRY = gql`
  mutation CreateMetricEntryMutation($input: CreateMetricEntryInput!) {
    createMetricEntry(input: $input) {
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

type NewMetricEntryModalProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  metric: Omit<Metric, 'latestEntry' | 'entries'>
  latestEntry: MetricEntry
  onCompleted: (newEntry: CreateMetricEntryMutation['createMetricEntry']) => void
}

const NewMetricEntryModal = (props: NewMetricEntryModalProps) => {
  const { isOpen, setIsOpen, metric, latestEntry, onCompleted } = props

  const [createMetricEntry, { loading }] = useMutation<CreateMetricEntryMutation, CreateMetricEntryMutationVariables>(
    CREATE_METRIC_ENTRY,
    {
      onCompleted: ({ createMetricEntry }) => {
        onCompleted(createMetricEntry)
        setIsOpen(false)
      },
    }
  )

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    createMetricEntry({ variables: { input: { metricId: metric.id, ...data } } })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <Form onSubmit={onSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>New Entry</DialogTitle>
          </DialogHeader>

          <FormInput
            name="value"
            type="number"
            label={`Value [ ${metric.unit} ]`}
            defaultValue={latestEntry.value}
            validation={{ required: true, valueAsNumber: true }}
            step="any"
          />

          <FormInput
            name="date"
            type="date"
            label="Date"
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

export default NewMetricEntryModal
