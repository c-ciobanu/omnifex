import { useEffect, useRef, useState } from 'react'

import { Pause, Play, SkipForward } from 'lucide-react'

import { Metadata } from '@redwoodjs/web'

import { Button } from 'src/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from 'src/components/ui/card'
import { formatSecondsToMinutesAndSeconds } from 'src/utils/time'

import alarm from './alarm.mp3'
import end from './end.mp3'
import ticking from './ticking.mp3'

const alarmSound = new Audio(alarm)
const endSound = new Audio(end)
const tickingSound = new Audio(ticking)

const sendNotification = (title: string, body: string) => {
  if (!Notification) {
    return
  }

  return new Notification(title, { body, tag: 'omnifex-time-pomodoro' })
}

const updateDocumentTitle = (secondsLeft: number) => {
  const formattedTimeLeft = formatSecondsToMinutesAndSeconds(secondsLeft)

  document.title = `${formattedTimeLeft} | Omnifex`
}

enum Phase {
  Pomodoro = 'Pomodoro',
  ShortBreak = 'Short break',
  LongBreak = 'Long break',
}

const phases = [
  Phase.Pomodoro,
  Phase.ShortBreak,
  Phase.Pomodoro,
  Phase.ShortBreak,
  Phase.Pomodoro,
  Phase.ShortBreak,
  Phase.Pomodoro,
  Phase.LongBreak,
  Phase.Pomodoro,
  Phase.ShortBreak,
  Phase.Pomodoro,
  Phase.ShortBreak,
]

type PomodoroTimerProps = {
  settings: { pomodoro: number; shortBreak: number; longBreak: number }
}

const PomodoroTimer = ({ settings }: PomodoroTimerProps) => {
  const [currentPhaseNumber, setCurrentPhaseNumber] = useState(0)
  const [currentPhaseName, setCurrentPhaseName] = useState(phases[currentPhaseNumber])
  const [secondsLeft, setSecondsLeft] = useState(settings.pomodoro * 60)
  const [isRunning, setIsRunning] = useState(true)
  const workerRef = useRef<Worker>()
  const tickRef = useRef(tick)

  useEffect(() => {
    tickRef.current = tick
  })

  useEffect(() => {
    workerRef.current = new Worker(new URL('./worker', import.meta.url), { type: 'module' })

    workerRef.current.onmessage = () => tickRef.current()
    workerRef.current.postMessage('start')

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  function tick(skip = false) {
    const nextPhaseName = phases[currentPhaseNumber + 1]
    const secondsToNextPhase = skip ? 0 : secondsLeft - 1

    if (!nextPhaseName && secondsToNextPhase === 0) {
      workerRef.current?.terminate()

      setSecondsLeft(0)

      sendNotification('You did it!', 'You made it to the end! Keep up the great work! 💪')
      endSound.play()
    } else if (secondsToNextPhase === 0) {
      if (currentPhaseName === Phase.Pomodoro) {
        setSecondsLeft((nextPhaseName === Phase.LongBreak ? settings.longBreak : settings.shortBreak) * 60)

        if (!skip) {
          sendNotification('Well done!', `Time to take a ${nextPhaseName.toLowerCase()} now.`)
        }
      } else {
        setSecondsLeft(settings.pomodoro * 60)

        if (!skip) {
          sendNotification('Hope you are well rested now!', `It's time to focus again.`)
        }
      }

      setCurrentPhaseNumber((state) => state + 1)
      setCurrentPhaseName(nextPhaseName)

      if (!skip) {
        alarmSound.play()
      }
    } else {
      setSecondsLeft(secondsToNextPhase)

      if (currentPhaseName === Phase.Pomodoro && secondsToNextPhase === 300) {
        sendNotification('5 minutes left', `Next: ${nextPhaseName}`)
      } else if (secondsToNextPhase === 60) {
        sendNotification('1 minute left', `Next: ${nextPhaseName}`)
      } else if (secondsToNextPhase === 5) {
        tickingSound.play()
      }
    }

    updateDocumentTitle(secondsToNextPhase)
  }

  const formattedTimeLeft = formatSecondsToMinutesAndSeconds(secondsLeft)

  return (
    <>
      <Metadata title={formattedTimeLeft} />

      <Card className="border-2 border-dashed py-10">
        <CardHeader>
          <CardDescription className="text-center">{currentPhaseName}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-center text-8xl">{formattedTimeLeft}</p>

          <div className="space-x-4 text-center">
            <Button
              size="icon"
              className="w-24"
              onClick={() => {
                workerRef.current.postMessage(isRunning ? 'pause' : 'start')
                setIsRunning((state) => !state)
              }}
            >
              {isRunning ? <Pause /> : <Play />}
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="w-24"
              onClick={() => {
                workerRef.current.postMessage('pause')
                tick(true)
                if (isRunning) {
                  workerRef.current.postMessage('start')
                }
              }}
            >
              <SkipForward />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default PomodoroTimer
