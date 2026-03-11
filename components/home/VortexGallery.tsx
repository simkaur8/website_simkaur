'use client'

import { useEffect, useRef } from 'react'
import { VortexItem } from './VortexItem'

// Hardcoded vortex layout data (positions from the prototype)
// Each item has: position (left%, top%), size class, ring, and optional link
const vortexItems = [
  // Ring 0 - Core (always visible)
  {
    id: 'crossfire',
    left: 50,
    top: 50,
    size: 'vx-lg',
    ring: 0,
    href: '/direction/crossfire',
    title: 'CROSSFIRE',
    tag: 'Dance Film',
    image: '/placeholder.svg',
  },
  {
    id: 'swamp',
    left: 44,
    top: 56,
    size: 'vx-sm',
    ring: 0,
    title: 'SWAMP',
    tag: 'Dance Film',
    image: '/placeholder.svg',
  },
  {
    id: 'elle',
    left: 58,
    top: 35,
    size: 'vx-md',
    ring: 0,
    href: '/direction/padani-for-elle-india',
    title: 'Padani for ELLE',
    tag: 'Fashion Film',
    image: '/placeholder.svg',
  },
  { id: 'still1', left: 56, top: 63, size: 'vx-wide', ring: 0, image: '/placeholder.svg' },
  {
    id: 'jiggy',
    left: 38,
    top: 42,
    size: 'vx-md',
    ring: 0,
    href: '/direction/jiggy-jaya-x-sftm',
    title: 'Jiggy Jaya x SFTM',
    tag: 'Fashion Film',
    image: '/placeholder.svg',
  },
  {
    id: 'velvet',
    left: 65,
    top: 42,
    size: 'vx-land',
    ring: 0,
    title: 'Velvet Skin',
    tag: 'Music Video',
    image: '/placeholder.svg',
  },
  { id: 'still2', left: 44, top: 67, size: 'vx-sm', ring: 0, image: '/placeholder.svg' },

  // Ring 1 - Inner orbit (hidden below 900px)
  { id: 'itm4l', left: 39, top: 30, size: 'vx-land', ring: 1, image: '/placeholder.svg' },
  {
    id: 'pam',
    left: 60,
    top: 26,
    size: 'vx-land',
    ring: 1,
    title: 'PAM Bali',
    tag: 'Fashion Film',
    image: '/placeholder.svg',
  },
  { id: 'oats', left: 72, top: 55, size: 'vx-land', ring: 1, image: '/placeholder.svg' },
  {
    id: 'paris',
    left: 28,
    top: 62,
    size: 'vx-land',
    ring: 1,
    title: 'Paris in Sydney',
    tag: 'Direction',
    image: '/placeholder.svg',
  },
  { id: 'pravaah1', left: 57, top: 76, size: 'vx-land-sm', ring: 1, image: '/placeholder.svg' },
  { id: 'cherry', left: 30, top: 38, size: 'vx-sm', ring: 1, image: '/placeholder.svg' },
  { id: 'eye1', left: 76, top: 28, size: 'vx-xs', ring: 1, image: '/placeholder.svg' },
  { id: 'pam-nick', left: 82, top: 28, size: 'vx-sm', ring: 1, image: '/placeholder.svg' },
  { id: 'sabor', left: 33, top: 76, size: 'vx-land', ring: 1, image: '/placeholder.svg' },

  // Ring 2 - Mid orbit (hidden below 900px)
  { id: 'brown', left: 74, top: 72, size: 'vx-tall', ring: 2, image: '/placeholder.svg' },
  { id: 'shysol', left: 18, top: 50, size: 'vx-sm', ring: 2, image: '/placeholder.svg' },
  { id: 'donna', left: 72, top: 25, size: 'vx-md', ring: 2, image: '/placeholder.svg' },
  { id: 'pravaah2', left: 48, top: 85, size: 'vx-land-sm', ring: 2, image: '/placeholder.svg' },
  { id: 'thandi', left: 26, top: 24, size: 'vx-sm', ring: 2, image: '/placeholder.svg' },
  { id: 'akshaya', left: 84, top: 54, size: 'vx-sm', ring: 2, image: '/placeholder.svg' },
  { id: 'install', left: 16, top: 70, size: 'vx-land', ring: 2, image: '/placeholder.svg' },
  { id: 'club', left: 56, top: 14, size: 'vx-sm', ring: 2, image: '/placeholder.svg' },
  { id: 'oats2', left: 68, top: 82, size: 'vx-sm', ring: 2, image: '/placeholder.svg' },
  { id: 'flux', left: 12, top: 36, size: 'vx-sm', ring: 2, image: '/placeholder.svg' },

  // Ring 3 - Outer orbit (only on 1200px+)
  { id: 'purg1', left: 85, top: 18, size: 'vx-xs', ring: 3, image: '/placeholder.svg' },
  { id: 'snakes', left: 34, top: 88, size: 'vx-xs', ring: 3, image: '/placeholder.svg' },
  { id: 'westfield', left: 38, top: 10, size: 'vx-xs', ring: 3, image: '/placeholder.svg' },
  { id: 'fragile', left: 88, top: 68, size: 'vx-xs', ring: 3, image: '/placeholder.svg' },
  { id: 'mia', left: 8, top: 60, size: 'vx-xs', ring: 3, image: '/placeholder.svg' },
  { id: 'culture', left: 10, top: 46, size: 'vx-tiny', ring: 3, image: '/placeholder.svg' },
  { id: 'eye2', left: 58, top: 94, size: 'vx-tiny', ring: 3, image: '/placeholder.svg' },
  { id: 'elle-ngo', left: 14, top: 18, size: 'vx-tiny', ring: 3, image: '/placeholder.svg' },
  { id: 'ref29', left: 92, top: 44, size: 'vx-xs', ring: 3, image: '/placeholder.svg' },
  { id: 'lia', left: 18, top: 84, size: 'vx-xs', ring: 3, image: '/placeholder.svg' },
  { id: 'purg2', left: 50, top: 4, size: 'vx-tiny', ring: 3, image: '/placeholder.svg' },
  { id: 'aafw', left: 82, top: 86, size: 'vx-tiny', ring: 3, image: '/placeholder.svg' },
  { id: 'yasmine', left: 64, top: 90, size: 'vx-xs', ring: 3, image: '/placeholder.svg' },
  { id: 'tiara', left: 22, top: 14, size: 'vx-land-sm', ring: 3, image: '/placeholder.svg' },
  { id: 'flux2', left: 42, top: 92, size: 'vx-sm', ring: 3, image: '/placeholder.svg' },

  // Ring 4 - Extra (1600px+)
  { id: 'nimrit', left: 5, top: 32, size: 'vx-xs', ring: 4, image: '/placeholder.svg' },
  { id: 'min', left: 94, top: 62, size: 'vx-xs', ring: 4, image: '/placeholder.svg' },
  { id: 'kuta', left: 6, top: 76, size: 'vx-tiny', ring: 4, image: '/placeholder.svg' },
  { id: 'punjab', left: 96, top: 28, size: 'vx-xs', ring: 4, image: '/placeholder.svg' },
  { id: 'maya', left: 28, top: 95, size: 'vx-tiny', ring: 4, image: '/placeholder.svg' },
]

export function VortexGallery() {
  const vortexRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let deg = 0
    let last = performance.now()
    const speed = 360 / 120000 // One rotation per 120 seconds
    let rafId: number

    function tick(now: number) {
      deg += speed * (now - last)
      last = now
      if (deg >= 360) deg -= 360

      if (vortexRef.current) {
        vortexRef.current.style.transform = `rotate(${deg}deg)`
        vortexRef.current.style.setProperty('--vx-angle', `${deg}deg`)
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame((now) => {
      last = now
      rafId = requestAnimationFrame(tick)
    })

    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <section className="vortex-wrap" id="gallerySection">
      <div className="vortex" ref={vortexRef}>
        {vortexItems.map((item) => (
          <VortexItem key={item.id} {...item} />
        ))}
      </div>
    </section>
  )
}
