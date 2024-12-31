import { Form, SubmitHandler } from '@redwoodjs/forms'
import { navigate, routes, useParams } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { FormInput } from 'src/components/OldForm/OldForm'

import ShowsCell from './ShowsCell'

interface FormValues {
  title: string
}

const SearchShowsPage = () => {
  const params = useParams()

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (data.title.length >= 1) {
      navigate(routes.searchShows({ q: data.title }))
    }
  }

  return (
    <>
      <Metadata title="Search TV Shows" />

      <Form onSubmit={onSubmit} className="mb-4">
        <FormInput type="search" name="title" defaultValue={params.q} placeholder="Search for a show" />
      </Form>

      {params.q ? <ShowsCell title={params.q} /> : null}
    </>
  )
}

export default SearchShowsPage
