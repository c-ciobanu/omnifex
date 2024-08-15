import { Metadata } from '@redwoodjs/web'

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'

import FavoritedBooksCell from './FavoritedBooksCell'
import ReadBooksCell from './ReadBooksCell'
import ToReadBooksCell from './ToReadBooksCell'

const BooksDashboardPage = () => {
  return (
    <>
      <Metadata title="Books Dashboard" robots="noindex" />

      <Tabs defaultValue="readingList">
        <TabsList>
          <TabsTrigger value="readingList">Reading List</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="readingList">
          <ToReadBooksCell />
        </TabsContent>
        <TabsContent value="read">
          <ReadBooksCell />
        </TabsContent>
        <TabsContent value="favorites">
          <FavoritedBooksCell />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default BooksDashboardPage
