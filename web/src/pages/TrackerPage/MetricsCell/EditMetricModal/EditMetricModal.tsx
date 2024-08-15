import type { MetricsQuery, UpdateMetricMutation, UpdateMetricMutationVariables } from 'types/graphql'

import { FieldError, Form, Label, Submit, TextField } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'src/components/ui/dialog'

const UPDATE_METRIC = gql`
  mutation UpdateMetricMutation($id: Int!, $input: UpdateMetricInput!) {
    updateMetric(id: $id, input: $input) {
      id
      name
      unit
    }
  }
`

type EditMetricModalProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  metric: MetricsQuery['metrics'][0]
}

const EditMetricModal = (props: EditMetricModalProps) => {
  const { isOpen, setIsOpen, metric } = props

  const [updateMetric, { loading }] = useMutation<UpdateMetricMutation, UpdateMetricMutationVariables>(UPDATE_METRIC, {
    onCompleted: () => {
      setIsOpen(false)
    },
  })

  function onSubmit(data: { name: string; unit?: string }) {
    updateMetric({ variables: { id: metric.id, input: data } })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <Form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Metric</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <fieldset>
              <Label name="name" className="form-label" errorClassName="form-label form-label-error">
                Name
              </Label>
              <TextField
                name="name"
                defaultValue={metric.name}
                className="form-input"
                errorClassName="form-input form-input-error"
                validation={{ required: true }}
              />
              <FieldError name="name" className="form-field-error" />
            </fieldset>

            <fieldset>
              <Label name="unit" className="form-label" errorClassName="form-label form-label-error">
                Unit
              </Label>
              <TextField
                name="unit"
                defaultValue={metric.unit}
                className="form-input"
                errorClassName="form-input form-input-error"
              />
              <FieldError name="unit" className="form-field-error" />
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

export default EditMetricModal
