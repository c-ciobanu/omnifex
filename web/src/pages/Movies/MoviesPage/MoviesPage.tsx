import { Form, SubmitHandler } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { FormInput } from 'src/components/OldForm/OldForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'

import MoviesWatchlistCell from './MoviesWatchlistCell'
import WatchedMoviesCell from './WatchedMoviesCell'

interface FormValues {
  title: string
}

const MoviesPage = () => {
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (data.title.length >= 1) {
      navigate(routes.searchMovies({ q: data.title }))
    }
  }

  return (
    <>
      <Metadata title="Movies" robots="noindex" />

      <Form onSubmit={onSubmit} className="mb-4">
        <FormInput type="search" name="title" placeholder="Search for a movie" />
      </Form>

      <Tabs defaultValue="watchlist">
        <TabsList>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="watched">Watched</TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist">
          <MoviesWatchlistCell />
        </TabsContent>
        <TabsContent value="watched">
          <WatchedMoviesCell />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default MoviesPage
