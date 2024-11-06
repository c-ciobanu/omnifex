import { useState } from 'react'

import type { MovieListsQuery, MovieListsQueryVariables } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps, TypedDocumentNode } from '@redwoodjs/web'

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'

import MovieListItemsCell from './MovieListItemsCell'

export const QUERY: TypedDocumentNode<MovieListsQuery, MovieListsQueryVariables> = gql`
  query MovieListsQuery {
    movieLists {
      id
      name
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }: CellFailureProps) => <div style={{ color: 'red' }}>Error: {error?.message}</div>

export const Success = ({ movieLists }: CellSuccessProps<MovieListsQuery>) => {
  const [tab, setTab] = useState(String(movieLists[0].id))

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        {movieLists.map((movieList) => (
          <TabsTrigger key={movieList.id} value={String(movieList.id)}>
            {movieList.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value={tab}>
        <MovieListItemsCell listId={Number(tab)} />
      </TabsContent>
    </Tabs>
  )
}
