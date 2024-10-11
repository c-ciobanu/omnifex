import { useState } from 'react'

import { Plus } from 'lucide-react'
import { CreateDocumentMutation, CreateDocumentMutationVariables } from 'types/graphql'

import { Form, SubmitHandler } from '@redwoodjs/forms'
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
import { FormField, FormInput } from 'src/components/ui/form'

import { QUERY } from '../DocumentsCell'

const CREATE_DOCUMENT = gql`
  mutation CreateDocumentMutation($input: CreateDocumentInput!) {
    createDocument(input: $input) {
      id
      title
    }
  }
`

interface FormValues {
  title: string
}

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
          data: { ...data, documents: [createDocument].concat(data.documents) },
        })
      },
    }
  )

  const onSubmit: SubmitHandler<FormValues> = (data) => {
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

      <DialogContent>
        <Form onSubmit={onSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>New Document</DialogTitle>
          </DialogHeader>

          <FormField name="title" label="Title">
            <FormInput name="title" validation={{ required: true }} />
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

export default NewDocument
