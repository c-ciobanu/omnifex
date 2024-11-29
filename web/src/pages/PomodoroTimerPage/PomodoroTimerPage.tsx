import { useState } from 'react'

import { Play } from 'lucide-react'

import { Form, SubmitHandler } from '@redwoodjs/forms'
import { Metadata } from '@redwoodjs/web'

import { FormField, FormInput } from 'src/components/OldForm/OldForm'
import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from 'src/components/ui/card'

import PomodoroTimer, { PomodoroTimerProps } from './PomodoroTimer'

type FormValues = {
  pomodoro: number
  shortBreak: number
  longBreak: number
}

const PomodoroTimerPage = () => {
  const [settings, setSettings] = useState<PomodoroTimerProps['settings']>()

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (Notification && Notification.permission !== 'granted') {
      Notification.requestPermission()
    }

    setSettings(data)
  }

  return (
    <>
      <Metadata title="Pomodoro Timer" />

      <div className="min-h-main flex flex-col items-center justify-center">
        {settings ? (
          <PomodoroTimer settings={settings} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Pomodoro Settings</CardTitle>
            </CardHeader>

            <Form onSubmit={onSubmit}>
              <CardContent className="space-y-6">
                <FormField name="pomodoro" label="Pomodoro">
                  <FormInput name="pomodoro" type="number" validation={{ required: true }} defaultValue={50} />
                </FormField>

                <FormField name="shortBreak" label="Short break">
                  <FormInput name="shortBreak" type="number" validation={{ required: true }} defaultValue={10} />
                </FormField>

                <FormField name="longBreak" label="Long break">
                  <FormInput name="longBreak" type="number" validation={{ required: true }} defaultValue={30} />
                </FormField>
              </CardContent>

              <CardFooter>
                <Button type="submit" className="w-full gap-2">
                  <Play className="h-4 w-4" /> Start
                </Button>
              </CardFooter>
            </Form>
          </Card>
        )}
      </div>
    </>
  )
}

export default PomodoroTimerPage
