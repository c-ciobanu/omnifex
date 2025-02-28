import { DocumentsQuery, UpdateDocumentTitleMutation, UpdateDocumentTitleMutationVariables } from 'types/graphql'

import { Form, SubmitHandler } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import { FormField, FormInput, FormSwitch } from 'src/components/OldForm/OldForm'
import { Button } from 'src/components/ui/button'
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

          <FormField name="title" label="Title">
            <FormInput name="title" defaultValue={document.title} validation={{ required: true }} />
          </FormField>

          <FormField name="isPublic" description="Anyone on the Internet with the link will be able to view it.">
            <FormSwitch name="isPublic" label="Public Access" defaultValue={document.isPublic} />
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

export default EditDocumentModal
