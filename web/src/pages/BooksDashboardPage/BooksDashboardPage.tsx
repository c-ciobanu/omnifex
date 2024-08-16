import { useState } from 'react'

import { UserBookType } from 'types/graphql'

import { Metadata } from '@redwoodjs/web'

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'

import UserBooksCell from './UserBooksCell'

const BooksDashboardPage = () => {
  const [tab, setTab] = useState<UserBookType>('TO_READ')

  return (
    <>
      <Metadata title="Books Dashboard" robots="noindex" />

      <Tabs value={tab} onValueChange={(value: UserBookType) => setTab(value)}>
        <TabsList>
          <TabsTrigger value="TO_READ">Reading List</TabsTrigger>
          <TabsTrigger value="READ">Read</TabsTrigger>
          <TabsTrigger value="FAVORITED">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          <UserBooksCell type={tab} />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default BooksDashboardPage
