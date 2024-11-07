import { Form, SubmitHandler } from '@redwoodjs/forms'
import { navigate, routes, useParams } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { FormInput } from 'src/components/ui/form'

import MoviesCell from './MoviesCell'

interface FormValues {
  title: string
}

const SearchMoviesPage = () => {
  const params = useParams()

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (data.title.length >= 1) {
      navigate(routes.searchMovies({ q: data.title }))
    }
  }

  return (
    <>
      <Metadata title="Search Movies" />

      <Form onSubmit={onSubmit} className="mb-4">
        <FormInput type="search" name="title" defaultValue={params.q} placeholder="Search for a movie" />
      </Form>

      {params.q ? <MoviesCell title={params.q} /> : null}
    </>
  )
}

export default SearchMoviesPage
