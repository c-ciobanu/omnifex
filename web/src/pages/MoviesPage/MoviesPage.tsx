import { Form, SubmitHandler } from '@redwoodjs/forms'
import { navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { FormInput } from 'src/components/ui/form'

import MovieListsCell from '../MoviesDashboardPage/MovieListsCell'

interface FormValues {
  title: string
}

const MoviesPage = () => {
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    if (data.title.length >= 1) {
      navigate(routes.search({ entity: 'movie', q: data.title }))
    }
  }

  return (
    <>
      <Metadata title="Movies" robots="noindex" />

      <Form onSubmit={onSubmit} className="mb-4">
        <FormInput type="search" name="title" placeholder="Search for a movie" />
      </Form>

      <MovieListsCell />
    </>
  )
}

export default MoviesPage
