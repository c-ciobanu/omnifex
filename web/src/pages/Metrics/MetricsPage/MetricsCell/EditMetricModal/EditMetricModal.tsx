import type { MetricsQuery, UpdateMetricMutation, UpdateMetricMutationVariables } from 'types/graphql'

import { SubmitHandler } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import { Form, FormSubmit } from 'src/components/form'
import { FormInput } from 'src/components/form/elements'
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

interface FormValues {
  name: string
  unit?: string
}

type EditMetricModalProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  metric: MetricsQuery['metrics'][number]
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

          <FormInput name="name" label="Name" defaultValue={metric.name} validation={{ required: true }} />

          <FormInput name="unit" label="Unit" defaultValue={metric.unit} />

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

export default EditMetricModal
