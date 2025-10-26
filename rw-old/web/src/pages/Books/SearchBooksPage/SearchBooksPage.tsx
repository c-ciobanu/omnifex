import { SubmitHandler } from '@redwoodjs/forms'
import { navigate, routes, useParams } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { Form } from 'src/components/form'
import { FormInput } from 'src/components/form/elements'

import BooksCell from './BooksCell'

interface FormValues {
  title: string
}

const SearchBooksPage = () => {
  const params = useParams()

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (data.title.length >= 1) {
      navigate(routes.searchBooks({ q: data.title }))
    }
  }

  return (
    <>
      <Metadata title="Search Books" />

      <Form onSubmit={onSubmit} className="mb-4">
        <FormInput type="search" name="title" defaultValue={params.q} placeholder="Search for a book" />
      </Form>

      {params.q ? <BooksCell title={params.q} /> : null}
    </>
  )
}

export default SearchBooksPage
