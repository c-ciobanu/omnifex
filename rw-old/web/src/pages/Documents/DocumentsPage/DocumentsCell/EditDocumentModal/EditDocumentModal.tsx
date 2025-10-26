import { DocumentsQuery, UpdateDocumentTitleMutation, UpdateDocumentTitleMutationVariables } from 'types/graphql'

import { SubmitHandler } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import { Form, FormSubmit } from 'src/components/form'
import { FormInput, FormSwitch } from 'src/components/form/elements'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'src/components/ui/dialog'

const UPDATE_DOCUMENT = gql`
  mutation UpdateDocumentTitleMutation($id: String!, $input: UpdateDocumentInput!) {
    updateDocument(id: $id, input: $input) {
      id
      title
      isPublic
    }
  }
`

interface FormValues {
  title: string
  isPublic: boolean
}

type EditDocumentModalProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  document: DocumentsQuery['documents'][number]
}

const EditDocumentModal = (props: EditDocumentModalProps) => {
  const { isOpen, setIsOpen, document } = props

  const [updateDocument, { loading }] = useMutation<UpdateDocumentTitleMutation, UpdateDocumentTitleMutationVariables>(
    UPDATE_DOCUMENT,
    {
      onCompleted: () => {
        setIsOpen(false)
      },
    }
  )

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    updateDocument({ variables: { id: document.id, input: data } })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <Form onSubmit={onSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
          </DialogHeader>

          <FormInput name="title" label="Title" defaultValue={document.title} validation={{ required: true }} />

          <FormSwitch
            name="isPublic"
            label="Public Access"
            description="Anyone on the Internet with the link will be able to view it."
            defaultChecked={document.isPublic}
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

export default EditDocumentModal
