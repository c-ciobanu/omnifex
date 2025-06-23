import { SubmitHandler } from '@cedarjs/forms'
import { navigate, routes, useParams } from '@cedarjs/router'
import { Metadata } from '@cedarjs/web'

import { Form } from 'src/components/form'
import { FormInput } from 'src/components/form/elements'

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
