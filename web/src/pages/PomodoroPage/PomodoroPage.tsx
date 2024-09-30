import { Play } from 'lucide-react'

import { Form, SubmitHandler } from '@redwoodjs/forms'
import { Metadata } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import { FormField, FormInput } from 'src/components/ui/form'

type FormValues = {
  pomodoro: string
  shortBreak: string
  longBreak: string
}

const PomodoroPage = () => {
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data)
  }

  return (
    <>
      <Metadata title="Pomodoro" />

      <div className="min-h-main flex flex-col items-center justify-center">
        <div className="rounded-lg bg-white p-6 shadow sm:w-full sm:max-w-md sm:p-12">
          <Form onSubmit={onSubmit} className="space-y-6">
            <FormField name="pomodoro" label="Pomodoro">
              <FormInput name="pomodoro" type="number" validation={{ required: true }} defaultValue="50" />
            </FormField>

            <FormField name="shortBreak" label="Short break">
              <FormInput name="shortBreak" type="number" validation={{ required: true }} defaultValue="10" />
            </FormField>

            <FormField name="longBreak" label="Long break">
              <FormInput name="longBreak" type="number" validation={{ required: true }} defaultValue="30" />
            </FormField>

            <Button type="submit" className="w-full gap-2">
              <Play className="h-4 w-4" /> Start
            </Button>
          </Form>
        </div>
      </div>
    </>
  )
}

export default PomodoroPage
