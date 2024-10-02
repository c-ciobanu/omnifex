import { useState } from 'react'

import { Metadata } from '@redwoodjs/web'

import { Card, CardContent, CardDescription, CardHeader } from 'src/components/ui/card'
import { useInterval } from 'src/hooks/useInterval/useInterval'

const formatSecondsToMinutesAndSeconds = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString()
  const s = (seconds % 60).toString()

  return `${m.padStart(2, '0')}:${s.padStart(2, '0')}`
}

enum Cycle {
  Pomodoro = 'Pomodoro',
  ShortBreak = 'Short break',
  LongBreak = 'Long break',
}

export type PomodoroTimerProps = {
  settings: { pomodoro: number; shortBreak: number; longBreak: number }
}

const PomodoroTimer = ({ settings }: PomodoroTimerProps) => {
  const [currentCycle, setCurrentCycle] = useState(Cycle.Pomodoro)
  const [secondsLeft, setSecondsLeft] = useState(settings.pomodoro * 60)
  const [runningCycle, setRunningCycle] = useState(1)

  useInterval(
    () => {
      if (runningCycle === 12 && secondsLeft === 1) {
        setSecondsLeft(0)
      } else if (secondsLeft === 1) {
        if (currentCycle === Cycle.Pomodoro) {
          setCurrentCycle(() => (runningCycle === 7 ? Cycle.LongBreak : Cycle.ShortBreak))
          setSecondsLeft(() => (runningCycle === 7 ? settings.longBreak * 60 : settings.shortBreak * 60))
        } else {
          setCurrentCycle(Cycle.Pomodoro)
          setSecondsLeft(settings.pomodoro * 60)
        }

        setRunningCycle((state) => state + 1)
      } else {
        setSecondsLeft((state) => state - 1)
      }
    },
    secondsLeft === 0 ? null : 1000
  )

  const formattedTimeLeft = formatSecondsToMinutesAndSeconds(secondsLeft)

  return (
    <>
      <Metadata title={formattedTimeLeft} />

      <Card className="border-2 border-dashed py-10">
        <CardHeader>
          <CardDescription className="text-center">{currentCycle}</CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-center text-8xl">{formattedTimeLeft}</p>
        </CardContent>
      </Card>
    </>
  )
}

export default PomodoroTimer
