import { useEffect, useRef } from 'react'

import { Search } from 'lucide-react'

import { Form, SubmitHandler, useForm } from '@redwoodjs/forms'
import { navigate, useParams } from '@redwoodjs/router'
import { routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import { FormField, FormInput, FormSelect } from 'src/components/ui/form'

import BooksCell from './BooksCell'
import MoviesCell from './MoviesCell'

const entityLabels = {
  book: 'Book',
  movie: 'Movie',
}

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
      <Metadata title={`${entityLabels[props.entity]} Search`} />

      <Form onSubmit={onSubmit} formMethods={formMethods} className="mb-4 flex gap-2">
        <FormField name="title" className="w-full">
          <FormInput
            ref={titleRef}
            name="title"
            defaultValue={params.q}
            placeholder={`Search for a ${props.entity}`}
            validation={{ required: true }}
          />
        </FormField>

        <FormField name="entity">
          <FormSelect
            name="entity"
            options={Object.keys(entityLabels).map((k) => ({ value: k, label: entityLabels[k] }))}
            defaultValue={props.entity}
            validation={{ required: true }}
            className="w-24 shrink-0"
          />
        </FormField>

        <Button type="submit" size="icon" className="shrink-0">
          <Search className="h-5 w-5" />
        </Button>
      </Form>

      {params.q ? props.entity === 'movie' ? <MoviesCell title={params.q} /> : <BooksCell title={params.q} /> : null}
    </>
  )
}

export default SearchPage
