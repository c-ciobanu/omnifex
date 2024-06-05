import { useEffect, useRef } from 'react'

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Form, SelectField, Submit, SubmitHandler, TextField, useForm } from '@redwoodjs/forms'
import { navigate, useParams } from '@redwoodjs/router'
import { routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import BooksCell from './BooksCell'
import MoviesCell from './MoviesCell'

interface FormValues {
  title: string
  entity: 'book' | 'movie'
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
      <Metadata title="Movie Search" />

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

        <Submit className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
          <FontAwesomeIcon icon={faMagnifyingGlass} fixedWidth />
        </Submit>
      </Form>

      {params.q ? props.entity === 'movie' ? <MoviesCell title={params.q} /> : <BooksCell title={params.q} /> : null}
    </>
  )
}

export default SearchPage
