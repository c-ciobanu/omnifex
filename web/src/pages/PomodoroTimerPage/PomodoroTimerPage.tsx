import { useState } from 'react'

import { useLocalStorage } from '@uidotdev/usehooks'
import { Play } from 'lucide-react'

import { SubmitHandler } from '@redwoodjs/forms'
import { Metadata } from '@redwoodjs/web'

import { Form, FormSubmit } from 'src/components/form'
import { FormInput } from 'src/components/form/elements'
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
                <FormInput name="pomodoro" type="number" label="Pomodoro" validation={{ required: true }} />

                <FormInput name="shortBreak" type="number" label="Short break" validation={{ required: true }} />

                <FormInput name="longBreak" type="number" label="Long break" validation={{ required: true }} />
              </CardContent>

              <CardFooter>
                <FormSubmit>
                  <Play /> Start
                </FormSubmit>
              </CardFooter>
            </Form>
          </Card>
        )}
      </div>
    </>
  )
}

export default PomodoroTimerPage
