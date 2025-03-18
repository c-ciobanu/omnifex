import { useState } from 'react'

import { useLocalStorage } from '@uidotdev/usehooks'
import { Play } from 'lucide-react'

import { Form, SubmitHandler } from '@redwoodjs/forms'
import { Metadata } from '@redwoodjs/web'

import { FormField, FormInput } from 'src/components/OldForm/OldForm'
import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from 'src/components/ui/card'

import PomodoroTimer from './PomodoroTimer'

type FormValues = {
  pomodoro: number
  shortBreak: number
  longBreak: number
}

const PomodoroTimerPage = () => {
  const [settings, setSettings] = useLocalStorage<FormValues>('pomodoroSettings', {
    pomodoro: 50,
    shortBreak: 10,
    longBreak: 30,
  })
  const [showTimer, setShowTimer] = useState(false)

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (Notification && Notification.permission !== 'granted') {
      Notification.requestPermission()
    }

    setSettings(data)
    setShowTimer(true)
  }

  return (
    <>
      <Metadata title="Pomodoro Timer" />

      <div className="min-h-main flex flex-col items-center justify-center">
        {showTimer ? (
          <PomodoroTimer settings={settings} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Pomodoro Settings</CardTitle>
            </CardHeader>

            <Form onSubmit={onSubmit} config={{ defaultValues: settings }}>
              <CardContent className="space-y-6">
                <FormField name="pomodoro" label="Pomodoro">
                  <FormInput name="pomodoro" type="number" validation={{ required: true }} />
                </FormField>

                <FormField name="shortBreak" label="Short break">
                  <FormInput name="shortBreak" type="number" validation={{ required: true }} />
                </FormField>

                <FormField name="longBreak" label="Long break">
                  <FormInput name="longBreak" type="number" validation={{ required: true }} />
                </FormField>
              </CardContent>

              <CardFooter>
                <Button type="submit" className="w-full">
                  <Play /> Start
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
