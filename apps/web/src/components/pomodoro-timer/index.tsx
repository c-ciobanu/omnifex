import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { formatSecondsToMinutesAndSeconds } from "@/utils/time";
import { Pause, Play, SkipForward } from "lucide-react";

import alarm from "./alarm.mp3";
import end from "./end.mp3";
import ticking from "./ticking.mp3";

const alarmSound = new Audio(alarm);
const endSound = new Audio(end);
const tickingSound = new Audio(ticking);

const sendNotification = (title: string, body: string) => {
  return new Notification(title, { body, tag: "omnifex-time-pomodoro" });
};

const updateDocumentTitle = (secondsLeft: number) => {
  const formattedTimeLeft = formatSecondsToMinutesAndSeconds(secondsLeft);

  document.title = `${formattedTimeLeft} | Omnifex`;
};

enum Phase {
  Pomodoro = "Pomodoro",
  ShortBreak = "Short break",
  LongBreak = "Long break",
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
];

interface PomodoroTimerProps {
  settings: { pomodoro: number; shortBreak: number; longBreak: number };
}

export function PomodoroTimer({ settings }: PomodoroTimerProps) {
  const [currentPhaseNumber, setCurrentPhaseNumber] = useState(0);
  const [currentPhaseName, setCurrentPhaseName] = useState(phases[currentPhaseNumber]);
  const [secondsLeft, setSecondsLeft] = useState(settings.pomodoro * 60);
  const [isRunning, setIsRunning] = useState(true);

  const workerRef = useRef<Worker>(new Worker(new URL("./worker", import.meta.url), { type: "module" }));

  async function tick(skip = false) {
    const nextPhaseName = phases[currentPhaseNumber + 1];
    const secondsToNextPhase = skip ? 0 : secondsLeft - 1;

    if (!nextPhaseName && secondsToNextPhase === 0) {
      workerRef.current.terminate();

      setSecondsLeft(0);

      sendNotification("You did it!", "You made it to the end! Keep up the great work! 💪");
      await endSound.play();
    } else if (nextPhaseName && secondsToNextPhase === 0) {
      if (currentPhaseName === Phase.Pomodoro) {
        setSecondsLeft((nextPhaseName === Phase.LongBreak ? settings.longBreak : settings.shortBreak) * 60);

        if (!skip) {
          sendNotification("Well done!", `Time to take a ${nextPhaseName.toLowerCase()} now.`);
        }
      } else {
        setSecondsLeft(settings.pomodoro * 60);

        if (!skip) {
          sendNotification("Hope you are well rested now!", `It's time to focus again.`);
        }
      }

      setCurrentPhaseNumber((state) => state + 1);
      setCurrentPhaseName(nextPhaseName);

      if (!skip) {
        await alarmSound.play();
      }
    } else {
      setSecondsLeft(secondsToNextPhase);

      if (currentPhaseName === Phase.Pomodoro && secondsToNextPhase === 300) {
        sendNotification("5 minutes left", `Next: ${nextPhaseName}`);
      } else if (secondsToNextPhase === 60) {
        sendNotification("1 minute left", `Next: ${nextPhaseName}`);
      } else if (secondsToNextPhase === 5) {
        await tickingSound.play();
      }
    }

    updateDocumentTitle(secondsToNextPhase);
  }

  const tickRef = useRef(tick);

  useEffect(() => {
    tickRef.current = tick;
  });

  useEffect(() => {
    workerRef.current.onmessage = () => tickRef.current();
    workerRef.current.postMessage("start");

    return () => {
      workerRef.current.terminate();
    };
  }, []);

  const formattedTimeLeft = formatSecondsToMinutesAndSeconds(secondsLeft);

  return (
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
              workerRef.current.postMessage(isRunning ? "pause" : "start");
              setIsRunning((state) => !state);
            }}
          >
            {isRunning ? <Pause /> : <Play />}
          </Button>

          <Button
            variant="secondary"
            size="icon"
            className="w-24"
            onClick={async () => {
              workerRef.current.postMessage("pause");

              await tick(true);

              if (isRunning) {
                workerRef.current.postMessage("start");
              }
            }}
          >
            <SkipForward />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
