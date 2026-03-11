'use client'

import { useSyncExternalStore } from 'react'

interface LogoVideoProps {
  webmSrc?: string
  movSrc?: string
  className?: string
}

function getIsSafari() {
  if (typeof navigator === 'undefined') return false
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

const subscribe = () => () => {}

export function LogoVideo({ webmSrc, movSrc, className }: LogoVideoProps) {
  const isSafari = useSyncExternalStore(subscribe, getIsSafari, () => false)
  const src = isSafari && movSrc ? movSrc : webmSrc || null

  if (!src) {
    return <div className={className} aria-hidden="true" />
  }

  return (
    <video autoPlay loop muted playsInline className={className} src={src} aria-hidden="true" />
  )
}
