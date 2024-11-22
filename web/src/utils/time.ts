export const formatSecondsToMinutesAndSeconds = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString()
  const s = (seconds % 60).toString()

  return `${m.padStart(2, '0')}:${s.padStart(2, '0')}`
}

export const formatSecondsToDescriptiveMinutesAndSeconds = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString()
  const s = (seconds % 60).toString()

  return `${m.padStart(2, '0')}m ${s.padStart(2, '0')}s`
}

export const formatTime = (time: string) => {
  return time.slice(0, 8)
}
