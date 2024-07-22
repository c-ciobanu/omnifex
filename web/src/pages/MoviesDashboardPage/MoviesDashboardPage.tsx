import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

import { Metadata } from '@redwoodjs/web'

import FavoritedMoviesCell from './FavoritedMoviesCell'
import ToWatchMoviesCell from './ToWatchMoviesCell'
import WatchedMoviesCell from './WatchedMoviesCell'

const MoviesDashboardPage = () => {
  return (
    <>
      <Metadata title="Movies Dashboard" robots="noindex" />

      <TabGroup>
        <TabList className="mb-4 inline-block space-x-5 border-b-2">
          <Tab className="-mb-[2px] border-b-2 pb-2 data-[hover]:border-gray-400 data-[selected]:border-blue-600">
            Watchlist
          </Tab>
          <Tab className="-mb-[2px] border-b-2 pb-2 data-[hover]:border-gray-400 data-[selected]:border-blue-600">
            Watched
          </Tab>
          <Tab className="-mb-[2px] border-b-2 pb-2 data-[hover]:border-gray-400 data-[selected]:border-blue-600">
            Favorites
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ToWatchMoviesCell />
          </TabPanel>
          <TabPanel>
            <WatchedMoviesCell />
          </TabPanel>
          <TabPanel>
            <FavoritedMoviesCell />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  )
}

export default MoviesDashboardPage
