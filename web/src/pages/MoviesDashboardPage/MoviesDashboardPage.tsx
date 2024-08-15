import { Metadata } from '@redwoodjs/web'

import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'

import FavoritedMoviesCell from './FavoritedMoviesCell'
import ToWatchMoviesCell from './ToWatchMoviesCell'
import WatchedMoviesCell from './WatchedMoviesCell'

const MoviesDashboardPage = () => {
  return (
    <>
      <Metadata title="Movies Dashboard" robots="noindex" />

      <Tabs defaultValue="watchlist">
        <TabsList>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="watched">Watched</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist">
          <ToWatchMoviesCell />
        </TabsContent>
        <TabsContent value="watched">
          <WatchedMoviesCell />
        </TabsContent>
        <TabsContent value="favorites">
          <FavoritedMoviesCell />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default MoviesDashboardPage
