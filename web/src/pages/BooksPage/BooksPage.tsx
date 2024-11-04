import { Form, SubmitHandler } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { FormInput } from 'src/components/ui/form'

import BookListsCell from '../BooksDashboardPage/BookListsCell'

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

      <BookListsCell />
    </>
  )
}

export default BooksPage
