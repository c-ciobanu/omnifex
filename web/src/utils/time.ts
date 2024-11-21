export const formatSecondsToMinutesAndSeconds = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString()
  const s = (seconds % 60).toString()

  return `${m.padStart(2, '0')}:${s.padStart(2, '0')}`
}
