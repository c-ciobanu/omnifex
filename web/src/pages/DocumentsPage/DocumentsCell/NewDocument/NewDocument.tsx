import { useState } from 'react'

import { Plus } from 'lucide-react'
import { CreateDocumentMutation, CreateDocumentMutationVariables } from 'types/graphql'

import { FieldError, Form, Label, Submit, TextField } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/dialog'

import { QUERY } from '../DocumentsCell'

const CREATE_DOCUMENT = gql`
  mutation CreateDocumentMutation($input: CreateDocumentInput!) {
    createDocument(input: $input) {
      id
      title
    }
  }
`

const NewDocument = () => {
  const [isOpen, setIsOpen] = useState(false)

  const [createMetric, { loading }] = useMutation<CreateDocumentMutation, CreateDocumentMutationVariables>(
    CREATE_DOCUMENT,
    {
      onCompleted: () => {
        setIsOpen(false)
      },
      update(cache, { data: { createDocument } }) {
        const data = cache.readQuery({ query: QUERY })

        cache.writeQuery({
          query: QUERY,
          data: { ...data, documents: data.documents.concat([createDocument]) },
        })
      },
    }
  )

  function onSubmit(data: { title: string }) {
    createMetric({ variables: { input: data } })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Document
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <Form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>New Document</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <fieldset>
              <Label name="title" className="form-label" errorClassName="form-label form-label-error">
                Title
              </Label>
              <TextField
                name="title"
                className="form-input"
                errorClassName="form-input form-input-error"
                validation={{ required: true }}
              />
              <FieldError name="title" className="form-field-error" />
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

export default NewDocument
