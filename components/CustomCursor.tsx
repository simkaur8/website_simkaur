'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'

function isTouchDevice() {
  if (typeof window === 'undefined') return true
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

function subscribe() {
  return () => {}
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const visibleRef = useRef(false)

  const isTouch = useSyncExternalStore(
    subscribe,
    () => isTouchDevice(),
    () => true
  )

  useEffect(() => {
    if (isTouch) return

    let mouseX = 0,
      mouseY = 0
    let ringX = 0,
      ringY = 0
    let isHovering = false
    let rafId: number

    function updateVisibility(show: boolean) {
      visibleRef.current = show
      if (dotRef.current) {
        dotRef.current.style.opacity = show ? '1' : '0'
      }
      if (ringRef.current) {
        ringRef.current.style.opacity = show ? '0.3' : '0'
      }
    }

    function onMouseMove(e: MouseEvent) {
      mouseX = e.clientX
      mouseY = e.clientY
      if (!visibleRef.current) updateVisibility(true)
    }

    function onMouseEnter() {
      updateVisibility(true)
    }
    function onMouseLeave() {
      updateVisibility(false)
    }

    function onElementHover(e: Event) {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [role="button"], .cursor-pointer')) {
        isHovering = true
      }
    }

    function onElementLeave() {
      isHovering = false
    }

    function animate() {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px) scale(${isHovering ? 1.5 : 1})`
      }

      rafId = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseover', onElementHover)
    document.addEventListener('mouseout', onElementLeave)
    rafId = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseover', onElementHover)
      document.removeEventListener('mouseout', onElementLeave)
      cancelAnimationFrame(rafId)
    }
  }, [isTouch])

  if (isTouch) return null

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-[var(--accent)]"
        style={{ opacity: 0, transition: 'opacity 0.3s' }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full border border-[var(--text-secondary)]"
        style={{
          opacity: 0,
          transition: 'opacity 0.3s',
          willChange: 'transform',
        }}
      />
    </>
  )
}
