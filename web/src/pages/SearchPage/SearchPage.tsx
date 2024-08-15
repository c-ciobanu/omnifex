import { useEffect, useRef } from 'react'

import { Search } from 'lucide-react'

import { Form, SelectField, Submit, SubmitHandler, TextField, useForm } from '@redwoodjs/forms'
import { navigate, useParams } from '@redwoodjs/router'
import { routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'

import BooksCell from './BooksCell'
import MoviesCell from './MoviesCell'

interface FormValues {
  title: string
  entity: 'book' | 'movie'
}

const titles = {
  book: 'Book',
  movie: 'Movie',
}

type SearchPageProps = {
  entity: FormValues['entity']
}

const SearchPage = (props: SearchPageProps) => {
  const params = useParams()
  const formMethods = useForm()
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    navigate(routes.search({ entity: data.entity, q: data.title }))
  }

  useEffect(() => {
    formMethods.resetField('entity', { defaultValue: props.entity })
  }, [props.entity])

  return (
    <>
      <Metadata title={`${titles[props.entity]} Search`} />

      <Form onSubmit={onSubmit} formMethods={formMethods} className="mb-4 flex gap-2">
        <TextField
          name="title"
          defaultValue={params.q}
          placeholder={`Search for a ${props.entity}`}
          className="form-input"
          ref={titleRef}
          validation={{ required: true, minLength: 1 }}
        />

        <SelectField name="entity" defaultValue={props.entity} className="form-input w-auto p-0">
          <option value="movie">Movie</option>
          <option value="book">Book</option>
        </SelectField>

        <Button asChild size="icon" className="mt-2 shrink-0">
          <Submit>
            <Search className="h-5 w-5" />
          </Submit>
        </Button>
      </Form>

      {params.q ? props.entity === 'movie' ? <MoviesCell title={params.q} /> : <BooksCell title={params.q} /> : null}
    </>
  )
}

export default SearchPage
