import { useReducer } from 'react'

import { File, MoreVertical } from 'lucide-react'
import type { DeleteDocumentMutation, DeleteDocumentMutationVariables, DocumentsQuery } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { type CellSuccessProps, type CellFailureProps, type TypedDocumentNode, useMutation } from '@redwoodjs/web'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'src/components/ui/alert-dialog'
import { Button } from 'src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'src/components/ui/dropdown-menu'

import NewDocument from './NewDocument/NewDocument'

export const QUERY: TypedDocumentNode<DocumentsQuery> = gql`
  query DocumentsQuery {
    documents {
      id
      title
    }
  }
`

const DELETE_DOCUMENT = gql`
  mutation DeleteDocumentMutation($id: String!) {
    deleteDocument(id: $id) {
      id
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => (
  <div className="min-h-main flex flex-col items-center justify-center gap-2">
    <File className="h-12 w-12" />
    <h3 className="text-2xl font-bold tracking-tight">You have no documents</h3>
    <p className="mb-4 text-sm text-muted-foreground">Get started by creating a new document.</p>
    <NewDocument />
  </div>
)

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

function deleteDocumentReducer(state, action) {
  switch (action.type) {
    case 'setIsOpen': {
      return {
        documentIndex: state.documentIndex,
        isOpen: action.nextIsOpen,
      }
    }
    case 'open': {
      return {
        documentIndex: action.nextDocumentIndex,
        isOpen: true,
      }
    }
  }

  throw Error('Unknown action: ' + action.type)
}

export const Success = ({ documents }: CellSuccessProps<DocumentsQuery>) => {
  const [state, dispatch] = useReducer(deleteDocumentReducer, { isOpen: false, documentIndex: 0 })

  const [deleteDocument, { loading }] = useMutation<DeleteDocumentMutation, DeleteDocumentMutationVariables>(
    DELETE_DOCUMENT,
    {
      variables: { id: documents[state.documentIndex]?.id },
      onCompleted: () => {
        dispatch({ type: 'setIsOpen', nextIsOpen: false })
      },
      update(cache, { data: { deleteDocument } }) {
        const data = cache.readQuery({ query: QUERY })

        cache.writeQuery({
          query: QUERY,
          data: { ...data, documents: data.documents.filter((d) => d.id !== deleteDocument.id) },
        })
      },
    }
  )

  return (
    <>
      <div className="mb-4 flex justify-end">
        <NewDocument />
      </div>

      <ul className="divide-y divide-white">
        {documents.map((document, index) => (
          <li key={document.id} className="flex items-center justify-between gap-6 py-4">
            <p className="text-sm font-medium">{document.title}</p>

            <div className="flex shrink-0 items-center gap-4">
              <Button asChild variant="outline">
                <Link to={routes.document({ id: document.id })} title={document.title}>
                  View Document
                </Link>
              </Button>

              <DropdownMenu>
                <Button asChild variant="ghost" size="icon">
                  <DropdownMenuTrigger>
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                </Button>

                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => dispatch({ type: 'open', nextDocumentIndex: index })}>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </li>
        ))}
      </ul>

      <AlertDialog open={state.isOpen} onOpenChange={(open) => dispatch({ type: 'setIsOpen', nextIsOpen: open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the document &#34;{documents[state.documentIndex]?.title}&#34;?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button variant="destructive" onClick={() => deleteDocument()} disabled={loading}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
