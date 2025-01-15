import { Form, SubmitHandler } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { FormInput } from 'src/components/OldForm/OldForm'

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
    </>
  )
}

export default ShowsPage
