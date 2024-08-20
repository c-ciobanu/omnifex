import { File } from 'lucide-react'
import type { DocumentsQuery } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps, TypedDocumentNode } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'

import NewDocument from './NewDocument/NewDocument'

export const QUERY: TypedDocumentNode<DocumentsQuery> = gql`
  query DocumentsQuery {
    documents {
      id
      title
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

export const Success = ({ documents }: CellSuccessProps<DocumentsQuery>) => {
  return (
    <>
      <div className="mb-4 flex justify-end">
        <NewDocument />
      </div>

      <ul className="divide-y divide-white">
        {documents.map((document) => (
          <li key={document.id} className="flex items-center justify-between gap-6 py-4">
            <p className="text-sm font-medium">{document.title}</p>

            <Button asChild variant="outline" className="shrink-0">
              <Link to={routes.document({ id: document.id })} title={document.title}>
                View Document
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </>
  )
}
