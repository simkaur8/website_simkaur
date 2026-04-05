'use client'

import { useSyncExternalStore } from 'react'

interface LogoVideoProps {
  webmSrc?: string
  mp4Src?: string
  fallbackImg?: string
  className?: string
  style?: React.CSSProperties
}

function getIsSafari() {
  if (typeof navigator === 'undefined') return false
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
}

const subscribe = () => () => {}

export function LogoVideo({
  webmSrc,
  mp4Src,
  fallbackImg = '/images/logo.png',
  className,
  style,
}: LogoVideoProps) {
  const isSafari = useSyncExternalStore(subscribe, getIsSafari, () => false)

  // Safari/iOS doesn't support mix-blend-mode on video reliably — use static image
  if (isSafari) {
    return <img src={fallbackImg} alt="" className={className} style={style} aria-hidden="true" />
  }

  if (!webmSrc && !mp4Src) {
    return <div className={className} style={style} aria-hidden="true" />
  }

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className={className}
      style={{ ...style, mixBlendMode: 'screen' }}
      aria-hidden="true"
    >
      {webmSrc && <source src={webmSrc} type="video/webm" />}
      {mp4Src && <source src={mp4Src} type="video/mp4" />}
    </video>
  )
}
