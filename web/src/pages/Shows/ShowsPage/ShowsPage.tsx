import { SubmitHandler } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { Form } from 'src/components/form'
import { FormInput } from 'src/components/form/elements'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'

import AbandonedShowsCell from './AbandonedShowsCell'
import ShowsWatchlistCell from './ShowsWatchlistCell'
import WatchedShowsCell from './WatchedShowsCell'

interface FormValues {
  title: string
}

const ShowsPage = () => {
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (data.title.length >= 1) {
      navigate(routes.searchShows({ q: data.title }))
    }
  }

  return (
    <>
      <Metadata title="Shows" robots="noindex" />

      <Form onSubmit={onSubmit} className="mb-4">
        <FormInput type="search" name="title" placeholder="Search for a show" />
      </Form>

      <Tabs defaultValue="watchlist">
        <TabsList>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="abandoned">Abandoned</TabsTrigger>
          <TabsTrigger value="watched">Watched</TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist">
          <ShowsWatchlistCell />
        </TabsContent>
        <TabsContent value="abandoned">
          <AbandonedShowsCell />
        </TabsContent>
        <TabsContent value="watched">
          <WatchedShowsCell />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default ShowsPage
