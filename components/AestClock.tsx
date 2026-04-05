'use client'

import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'

function getAestTime() {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Australia/Sydney' }))
}

function formatTime(date: Date) {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m} AEST`
}

let currentTime = ''

const mountedSubscribe = () => () => {}

export function AestClock() {
  const mounted = useSyncExternalStore(
    mountedSubscribe,
    () => true,
    () => false
  )
  const listenersRef = useRef(new Set<() => void>())

  const subscribe = useCallback((cb: () => void) => {
    listenersRef.current.add(cb)
    return () => listenersRef.current.delete(cb)
  }, [])

  const getSnapshot = useCallback(() => currentTime, [])
  const getServerSnapshot = useCallback(() => formatTime(getAestTime()), [])

  useEffect(() => {
    const update = () => {
      currentTime = formatTime(getAestTime())
      listenersRef.current.forEach((cb) => cb())
    }
    update()
    const interval = setInterval(update, 10000)
    return () => clearInterval(interval)
  }, [])

  const time = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const spanClass =
    'font-sans text-[0.7rem] uppercase tracking-[0.12em] text-[var(--text-muted)] tabular-nums'

  if (!mounted)
    return <span className={spanClass}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>

  if (!time) return null

  return (
    <span className={spanClass} aria-label={`Current time: ${time}`}>
      {time}
    </span>
  )
}
