import type { DocumentQuery, DocumentQueryVariables } from 'types/graphql'

import { type CellSuccessProps, type CellFailureProps, type TypedDocumentNode, Metadata } from '@redwoodjs/web'

import LexicalEditor from './LexicalEditor/LexicalEditor'

export const QUERY: TypedDocumentNode<DocumentQuery, DocumentQueryVariables> = gql`
  query DocumentQuery($id: String!) {
    document: document(id: $id) {
      id
      title
      body
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps<DocumentQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = ({ document }: CellSuccessProps<DocumentQuery, DocumentQueryVariables>) => {
  return (
    <>
      <Metadata title={document.title} robots="noindex" />

      <h2 className="mb-4 text-lg font-semibold md:text-2xl">{document.title}</h2>

      <LexicalEditor document={document} />
    </>
  )
}
