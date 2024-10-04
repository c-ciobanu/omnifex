import { useState } from 'react'

import { Metadata } from '@redwoodjs/web'

import { Card, CardContent, CardDescription, CardHeader } from 'src/components/ui/card'
import { useInterval } from 'src/hooks/useInterval/useInterval'

import alarm from './alarm.mp3'
import end from './end.mp3'
import ticking from './ticking.mp3'

const alarmSound = new Audio(alarm)
const endSound = new Audio(end)
const tickingSound = new Audio(ticking)

const formatSecondsToMinutesAndSeconds = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString()
  const s = (seconds % 60).toString()

  return `${m.padStart(2, '0')}:${s.padStart(2, '0')}`
}

const sendNotification = (title: string, body: string) => {
  if (!Notification) {
    return
  }

  return new Notification(title, { body })
}

enum Phase {
  Pomodoro = 'Pomodoro',
  ShortBreak = 'Short break',
  LongBreak = 'Long break',
}

export type PomodoroTimerProps = {
  settings: { pomodoro: number; shortBreak: number; longBreak: number }
}

const PomodoroTimer = ({ settings }: PomodoroTimerProps) => {
  const [currentPhase, setCurrentPhase] = useState(Phase.Pomodoro)
  const [secondsLeft, setSecondsLeft] = useState(settings.pomodoro * 60)
  const [runningPhase, setRunningPhase] = useState(1)

  useInterval(
    () => {
      const nextPhase = runningPhase === 7 ? Phase.LongBreak : Phase.ShortBreak
      const secondsToNextPhase = secondsLeft - 1

      if (runningPhase === 12 && secondsToNextPhase === 0) {
        setSecondsLeft(0)

        sendNotification('You did it!', 'You made it to the end! Keep up the great work! 💪')
        endSound.play()
      } else if (secondsToNextPhase === 0) {
        if (currentPhase === Phase.Pomodoro) {
          setCurrentPhase(nextPhase)
          setSecondsLeft((nextPhase === Phase.LongBreak ? settings.longBreak : settings.shortBreak) * 60)

          sendNotification('Well done!', `Time to take a ${nextPhase.toLowerCase()} now.`)
        } else {
          setCurrentPhase(Phase.Pomodoro)
          setSecondsLeft(settings.pomodoro * 60)

          sendNotification('Hope you are well rested now!', `It's time to go at it again.`)
        }

        setRunningPhase((state) => state + 1)

        alarmSound.play()
      } else {
        setSecondsLeft(secondsToNextPhase)

        if (currentPhase === Phase.Pomodoro && secondsToNextPhase === 300) {
          sendNotification('Pomodoro ending soon!', `A ${nextPhase.toLowerCase()} is coming next in 5 minutes.`)
        } else if (currentPhase === Phase.Pomodoro && secondsToNextPhase === 60) {
          sendNotification('Pomodoro ending soon!', `A ${nextPhase.toLowerCase()} is coming next in 1 minute.`)
        } else if (secondsToNextPhase === 60) {
          sendNotification('Break ending soon!', `A ${nextPhase.toLowerCase()} is coming next in 1 minute.`)
        } else if (secondsToNextPhase === 5) {
          tickingSound.play()
        }
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
          <CardDescription className="text-center">{currentPhase}</CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-center text-8xl">{formattedTimeLeft}</p>
        </CardContent>
      </Card>
    </>
  )
}

export default PomodoroTimer
