import { useState } from 'react'

import type { BookListsQuery, BookListsQueryVariables } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps, TypedDocumentNode } from '@redwoodjs/web'

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'

import BookListItemsCell from './BookListItemsCell'

export const QUERY: TypedDocumentNode<BookListsQuery, BookListsQueryVariables> = gql`
  query BookListsQuery {
    bookLists {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ bookLists }: CellSuccessProps<BookListsQuery>) => {
  const [tab, setTab] = useState(String(bookLists[0].id))

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        {bookLists.map((bookList) => (
          <TabsTrigger key={bookList.id} value={String(bookList.id)}>
            {bookList.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={tab}>
        <BookListItemsCell listId={Number(tab)} />
      </TabsContent>
    </Tabs>
  )
}
