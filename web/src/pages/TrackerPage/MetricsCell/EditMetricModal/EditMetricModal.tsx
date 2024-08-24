import type { MetricsQuery, UpdateMetricMutation, UpdateMetricMutationVariables } from 'types/graphql'

import { Form, SubmitHandler } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'src/components/ui/dialog'
import { FormField, FormInput } from 'src/components/ui/form'

const UPDATE_METRIC = gql`
  mutation UpdateMetricMutation($id: Int!, $input: UpdateMetricInput!) {
    updateMetric(id: $id, input: $input) {
      id
      name
      unit
    }
  }
`

interface FormValues {
  name: string
  unit?: string
}

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

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    updateMetric({ variables: { id: metric.id, input: data } })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <Form onSubmit={onSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Edit Metric</DialogTitle>
          </DialogHeader>

          <FormField name="name" label="Name">
            <FormInput name="name" defaultValue={metric.name} validation={{ required: true }} />
          </FormField>

          <FormField name="unit" label="Unit">
            <FormInput name="unit" defaultValue={metric.unit} />
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

export default EditMetricModal
