import { useState } from 'react'

import { Plus } from 'lucide-react'
import { CreateDocumentMutation, CreateDocumentMutationVariables } from 'types/graphql'

import { SubmitHandler } from '@redwoodjs/forms'
import { useMutation } from '@redwoodjs/web'

import { Form, FormSubmit } from 'src/components/form'
import { FormInput } from 'src/components/form/elements'
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
        <Button>
          <Plus />
          New Document
        </Button>
      </DialogTrigger>

      <DialogContent>
        <Form onSubmit={onSubmit} className="space-y-6">
          <DialogHeader>
            <DialogTitle>New Document</DialogTitle>
          </DialogHeader>

          <FormInput name="title" label="Title" validation={{ required: true }} />

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

export default NewDocument
