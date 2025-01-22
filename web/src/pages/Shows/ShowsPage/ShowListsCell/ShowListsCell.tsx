import { useState } from 'react'

import type { ShowListsQuery, ShowListsQueryVariables } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps, TypedDocumentNode } from '@redwoodjs/web'

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'

import ShowListItemsCell from './ShowListItemsCell'

export const QUERY: TypedDocumentNode<ShowListsQuery, ShowListsQueryVariables> = gql`
  query ShowListsQuery {
    showLists {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ showLists }: CellSuccessProps<ShowListsQuery>) => {
  const [tab, setTab] = useState(String(showLists[0].id))

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        {showLists.map((showList) => (
          <TabsTrigger key={showList.id} value={String(showList.id)}>
            {showList.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={tab}>
        <ShowListItemsCell listId={Number(tab)} />
      </TabsContent>
    </Tabs>
  )
}
