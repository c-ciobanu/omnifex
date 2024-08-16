import type { MetricQuery, UpdateMetricEntryMutation, UpdateMetricEntryMutationVariables } from 'types/graphql'

import { DateField, FieldError, Form, Label, Submit, TextField } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

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

type EditMetricEntryModalProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  metric: MetricQuery['metric']
  metricEntry: MetricQuery['metric']['entries'][0]
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

  function onSubmit({ value, date }: { value: string; date: Date }) {
    updateMetricEntry({
      variables: { id: metricEntry.id, input: { value, date: date.toISOString().substring(0, 10) } },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <Form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Metric Entry</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <fieldset>
              <Label name="value" className="form-label" errorClassName="form-label form-label-error">
                Value [ {metric.unit} ]
              </Label>
              <TextField
                name="value"
                defaultValue={metricEntry.value}
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
                defaultValue={metricEntry.date}
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

export default EditMetricEntryModal
