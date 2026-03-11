'use client'

import { useSyncExternalStore } from 'react'

interface LogoVideoProps {
  webmSrc?: string
  movSrc?: string
  className?: string
  style?: React.CSSProperties
}

function getIsSafari() {
  if (typeof navigator === 'undefined') return false
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

const subscribe = () => () => {}

export function LogoVideo({ webmSrc, movSrc, className, style }: LogoVideoProps) {
  const isSafari = useSyncExternalStore(subscribe, getIsSafari, () => false)
  const src = isSafari && movSrc ? movSrc : webmSrc || null

  if (!src) {
    return <div className={className} style={style} aria-hidden="true" />
  }

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className={className}
      style={style}
      src={src}
      aria-hidden="true"
    />
  )
}
