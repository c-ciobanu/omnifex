import { Form, SubmitHandler } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { FormInput } from 'src/components/OldForm/OldForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'src/components/ui/tabs'

import BooksReadingListCell from './BooksReadingListCell'
import ReadBooksCell from './ReadBooksCell'

interface FormValues {
  title: string
}

const BooksPage = () => {
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (data.title.length >= 1) {
      navigate(routes.searchBooks({ q: data.title }))
    }
  }

  return (
    <>
      <Metadata title="Books" robots="noindex" />

      <Form onSubmit={onSubmit} className="mb-4">
        <FormInput type="search" name="title" placeholder="Search for a book" />
      </Form>

      <Tabs defaultValue="watchlist">
        <TabsList>
          <TabsTrigger value="watchlist">Reading List</TabsTrigger>
          <TabsTrigger value="watched">Read</TabsTrigger>
        </TabsList>

        <TabsContent value="watchlist">
          <BooksReadingListCell />
        </TabsContent>
        <TabsContent value="watched">
          <ReadBooksCell />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default BooksPage
