import { useState } from 'react'

import { Play } from 'lucide-react'

import { Form, SubmitHandler } from '@redwoodjs/forms'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from 'src/components/ui/card'
import { FormField, FormInput } from 'src/components/ui/form'

import PomodoroTimer, { PomodoroTimerProps } from './PomodoroTimer'

type FormValues = {
  pomodoro: string
  shortBreak: string
  longBreak: string
}

const PomodoroTimerPage = () => {
  const { isAuthenticated } = useAuth()
  const [settings, setSettings] = useState<PomodoroTimerProps['settings']>()

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (Notification && Notification.permission !== 'granted') {
      Notification.requestPermission()
    }

    setSettings({
      pomodoro: Number(data.pomodoro),
      shortBreak: Number(data.shortBreak),
      longBreak: Number(data.longBreak),
    })
  }

  return (
    <>
      <Metadata title="Pomodoro Timer" />

      <div className="min-h-main flex flex-col items-center justify-center">
        <div className="space-y-6 text-center xl:hidden">
          <h1 className="text-3xl font-bold tracking-tight">Device not supported</h1>
          <p className="text-muted-foreground">Sorry, this feature is not supported on your device.</p>
          <Button asChild>
            <Link to={isAuthenticated ? routes.documents() : routes.home()}>Go back home</Link>
          </Button>
        </div>

        <div className="hidden xl:block">
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
                    <FormInput name="pomodoro" type="number" validation={{ required: true }} defaultValue="50" />
                  </FormField>

                  <FormField name="shortBreak" label="Short break">
                    <FormInput name="shortBreak" type="number" validation={{ required: true }} defaultValue="10" />
                  </FormField>

                  <FormField name="longBreak" label="Long break">
                    <FormInput name="longBreak" type="number" validation={{ required: true }} defaultValue="30" />
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
      </div>
    </>
  )
}

export default PomodoroTimerPage
