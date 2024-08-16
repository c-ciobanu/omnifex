import { useState } from 'react'

import { UserMovieType } from 'types/graphql'

import { Metadata } from '@redwoodjs/web'

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'

import UserMoviesCell from './UserMoviesCell'

const MoviesDashboardPage = () => {
  const [tab, setTab] = useState<UserMovieType>('TO_WATCH')
  return (
    <>
      <Metadata title="Movies Dashboard" robots="noindex" />

      <Tabs value={tab} onValueChange={(value: UserMovieType) => setTab(value)}>
        <TabsList>
          <TabsTrigger value="TO_WATCH">Watchlist</TabsTrigger>
          <TabsTrigger value="WATCHED">Watched</TabsTrigger>
          <TabsTrigger value="FAVORITED">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          <UserMoviesCell type={tab} />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default MoviesDashboardPage
