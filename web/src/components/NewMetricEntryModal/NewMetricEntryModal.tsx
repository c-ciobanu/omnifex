import { CreateMetricEntryMutation, CreateMetricEntryMutationVariables, Metric, MetricEntry } from 'types/graphql'

import { Form, SubmitHandler } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'src/components/ui/dialog'
import { FormField, FormInput } from 'src/components/ui/form'

const CREATE_METRIC_ENTRY = gql`
  mutation CreateMetricEntryMutation($input: CreateMetricEntryInput!) {
    createMetricEntry(input: $input) {
      id
      value
      date
    }
  }
`

interface FormValues {
  value: string
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

          <FormField name="value" label={`Value [ ${metric.unit} ]`}>
            <FormInput name="value" defaultValue={latestEntry.value} validation={{ required: true }} />
          </FormField>

          <FormField name="date" label="Date">
            <FormInput
              name="date"
              type="date"
              defaultValue={new Date().toISOString().substring(0, 10)}
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

export default NewMetricEntryModal
