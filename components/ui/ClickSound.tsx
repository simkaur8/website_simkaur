'use client'

import { useEffect, useRef } from 'react'

/**
 * Global click-sound provider.
 * Synthesises a short mouse-click sound (2000s-era) via the Web Audio API
 * on every <a>, <button>, and [role="button"] click across the entire page.
 * Volume is deliberately subtle so it feels tactile rather than intrusive.
 */
export function ClickSound() {
  const ctxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    function play() {
      // Lazily create AudioContext on first interaction (browser policy)
      if (!ctxRef.current) {
        ctxRef.current = new AudioContext()
      }
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') ctx.resume()

      const t = ctx.currentTime

      // — Mouse-click impulse: short filtered noise burst (~20ms) —
      const clickLen = 0.02
      const bufferSize = Math.ceil(ctx.sampleRate * clickLen)
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      // Sharp impulse that decays quickly, like a physical button snap
      for (let i = 0; i < bufferSize; i++) {
        const env = Math.exp(-i / (bufferSize * 0.15))
        data[i] = (Math.random() * 2 - 1) * env
      }

      const source = ctx.createBufferSource()
      source.buffer = buffer

      // Bandpass filter to shape it into a crisp click (centred ~3kHz)
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 3000
      filter.Q.value = 1.2

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.12, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + clickLen)

      source.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      source.start(t)
      source.stop(t + clickLen)
    }

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      if (!target) return
      // Walk up to find an interactive element (max 5 levels)
      let el: HTMLElement | null = target
      for (let i = 0; i < 5 && el; i++) {
        const tag = el.tagName
        if (tag === 'A' || tag === 'BUTTON' || el.getAttribute('role') === 'button') {
          play()
          return
        }
        el = el.parentElement
      }
    }

    document.addEventListener('click', handleClick, { passive: true })
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
