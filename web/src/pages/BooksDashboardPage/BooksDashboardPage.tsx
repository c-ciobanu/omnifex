import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

import { Metadata } from '@redwoodjs/web'

import FavoritedBooksCell from 'src/components/FavoritedBooksCell'
import ReadBooksCell from 'src/components/ReadBooksCell'
import ToReadBooksCell from 'src/components/ToReadBooksCell'

const BooksDashboardPage = () => {
  return (
    <>
      <Metadata title="Books Dashboard" robots="noindex" />

      <TabGroup>
        <TabList className="mb-4 inline-block space-x-5 border-b-2">
          <Tab className="-mb-[2px] border-b-2 pb-2 data-[hover]:border-gray-400 data-[selected]:border-blue-600">
            Reading List
          </Tab>
          <Tab className="-mb-[2px] border-b-2 pb-2 data-[hover]:border-gray-400 data-[selected]:border-blue-600">
            Read
          </Tab>
          <Tab className="-mb-[2px] border-b-2 pb-2 data-[hover]:border-gray-400 data-[selected]:border-blue-600">
            Favorites
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <ToReadBooksCell />
          </TabPanel>
          <TabPanel>
            <ReadBooksCell />
          </TabPanel>
          <TabPanel>
            <FavoritedBooksCell />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  )
}

export default BooksDashboardPage
