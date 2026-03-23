'use client'

import { useEffect, useRef } from 'react'

/**
 * Global click-sound provider.
 * Synthesises a very short (~60 ms) retro keyboard-tap sound via the Web Audio API
 * on every <a>, <button>, and [role="button"] click across the entire page.
 * Volume is deliberately subtle so it feels tactile rather than intrusive.
 */
export function ClickSound() {
  const ctxRef = useRef<AudioContext | null>(null)

  useEffect(() => {
    function play() {
      // Lazily create AudioContext on first interaction (browser policy)
      if (!ctxRef.current) {
        ctxRef.current = new AudioContext()
      }
      const ctx = ctxRef.current
      if (ctx.state === 'suspended') ctx.resume()

      // Short noise burst → feels like a light key tap
      const duration = 0.06 // seconds
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.08, ctx.currentTime) // very quiet
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      gain.connect(ctx.destination)

      const osc = ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + duration)
      osc.connect(gain)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
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
