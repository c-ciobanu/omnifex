import { useEffect, useRef } from 'react'

export const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef(callback)

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    if (delay !== null) {
      const intervalId = setInterval(tick, delay)

      return () => clearInterval(intervalId)
    }
  }, [delay])
}
