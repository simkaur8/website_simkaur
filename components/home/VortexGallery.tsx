'use client'

import { useEffect, useRef } from 'react'
import { VortexItem } from './VortexItem'

const V = '/images/vortex'

const vortexItems = [
  // ═══ RING 0 — Core (always visible) ═══
  {
    id: 'crossfire',
    left: 50,
    top: 50,
    size: 'vx-lg',
    ring: 0,
    href: '/direction/crossfire',
    title: 'CROSSFIRE',
    tag: 'Dance Film',
    image: `${V}/crossfire.png`,
    imageStyle: 'object-position:center top',
  },
  {
    id: 'swamp',
    left: 44,
    top: 56,
    size: 'vx-sm',
    ring: 0,
    href: '/direction/swamp',
    title: 'SWAMP',
    tag: 'Dance Film',
    image: `${V}/swamp.webp`,
    under: true,
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
    image: `${V}/padani1.jpg`,
  },
  {
    id: 'still1',
    left: 56,
    top: 63,
    size: 'vx-wide',
    ring: 0,
    image: `${V}/crossfire6.jpg`,
    imageStyle: 'object-position:center 30%',
  },
  {
    id: 'jiggy',
    left: 38,
    top: 42,
    size: 'vx-md',
    ring: 0,
    href: '/direction/jiggy-jaya-x-sftm',
    title: 'Jiggy Jaya x SFTM',
    tag: 'Fashion Film',
    image: `${V}/jiggy.jpg`,
  },
  {
    id: 'velvet',
    left: 65,
    top: 42,
    size: 'vx-land',
    ring: 0,
    href: '/direction/velvet-skin',
    title: 'Velvet Skin',
    tag: 'Music Video',
    image: `${V}/velvet-skin.webp`,
  },
  {
    id: 'still2',
    left: 44,
    top: 67,
    size: 'vx-sm',
    ring: 0,
    image: `${V}/padani2.jpg`,
  },

  // ═══ RING 1 — Inner orbit (hidden on phone) ═══
  {
    id: 'itm4l',
    left: 39,
    top: 30,
    size: 'vx-land',
    ring: 1,
    image: `${V}/itm4l.webp`,
  },
  {
    id: 'pam',
    left: 60,
    top: 26,
    size: 'vx-land',
    ring: 1,
    href: '/direction/pam-bali',
    title: 'PAM Bali',
    tag: 'Fashion Film',
    image: `${V}/pam-bali.webp`,
  },
  {
    id: 'oats',
    left: 72,
    top: 55,
    size: 'vx-land',
    ring: 1,
    image: `${V}/oats.webp`,
  },
  {
    id: 'paris',
    left: 28,
    top: 62,
    size: 'vx-land',
    ring: 1,
    href: '/direction/paris-in-sydney',
    title: 'Paris in Sydney',
    tag: 'Direction',
    image: `${V}/paris-syd.webp`,
    imageStyle: 'object-position:center top',
  },
  {
    id: 'pravaah1',
    left: 57,
    top: 76,
    size: 'vx-land-sm',
    ring: 1,
    image: `${V}/pravaah1.webp`,
  },
  {
    id: 'cherry',
    left: 30,
    top: 38,
    size: 'vx-sm',
    ring: 1,
    image: `${V}/cherry-chola.jpg`,
  },
  {
    id: 'eye1',
    left: 76,
    top: 28,
    size: 'vx-xs',
    ring: 1,
    image: `${V}/eye4.webp`,
  },
  {
    id: 'pam-nick',
    left: 82,
    top: 28,
    size: 'vx-sm',
    ring: 1,
    image: `${V}/pam-nick.webp`,
  },
  {
    id: 'sabor',
    left: 33,
    top: 76,
    size: 'vx-land',
    ring: 1,
    image: `${V}/sabor.webp`,
  },

  // ═══ RING 2 — Mid orbit (hidden below 900px) ═══
  {
    id: 'brown',
    left: 74,
    top: 72,
    size: 'vx-tall',
    ring: 2,
    image: `${V}/brown-suga.jpg`,
  },
  {
    id: 'shysol',
    left: 18,
    top: 50,
    size: 'vx-sm',
    ring: 2,
    image: `${V}/shysol.webp`,
  },
  {
    id: 'donna',
    left: 72,
    top: 25,
    size: 'vx-md',
    ring: 2,
    image: `${V}/donna.jpg`,
  },
  {
    id: 'pravaah2',
    left: 48,
    top: 85,
    size: 'vx-land-sm',
    ring: 2,
    image: `${V}/pravaah2.webp`,
  },
  {
    id: 'thandi',
    left: 26,
    top: 24,
    size: 'vx-sm',
    ring: 2,
    image: `${V}/thandi.webp`,
  },
  {
    id: 'akshaya',
    left: 84,
    top: 54,
    size: 'vx-sm',
    ring: 2,
    image: `${V}/akshaya.webp`,
  },
  {
    id: 'install',
    left: 16,
    top: 70,
    size: 'vx-land',
    ring: 2,
    image: `${V}/install.webp`,
  },
  {
    id: 'club',
    left: 56,
    top: 14,
    size: 'vx-sm',
    ring: 2,
    image: `${V}/club13.webp`,
  },
  {
    id: 'oats2',
    left: 68,
    top: 82,
    size: 'vx-sm',
    ring: 2,
    image: `${V}/oats2.webp`,
  },
  {
    id: 'flux',
    left: 12,
    top: 36,
    size: 'vx-sm',
    ring: 2,
    image: `${V}/flux.webp`,
  },

  // ═══ RING 3 — Outer orbit (only on 1200px+) ═══
  {
    id: 'purg1',
    left: 85,
    top: 18,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/purgatory.webp`,
  },
  {
    id: 'snakes',
    left: 34,
    top: 88,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/snakes.jpg`,
  },
  {
    id: 'westfield',
    left: 38,
    top: 10,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/westfield.jpg`,
  },
  {
    id: 'fragile',
    left: 88,
    top: 68,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/fragile.webp`,
  },
  {
    id: 'mia',
    left: 8,
    top: 60,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/mia.jpg`,
  },
  {
    id: 'culture',
    left: 10,
    top: 46,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/culture.jpg`,
  },
  {
    id: 'eye2',
    left: 58,
    top: 94,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/eye9.webp`,
  },
  {
    id: 'elle-ngo',
    left: 14,
    top: 18,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/elle-ngo.webp`,
  },
  {
    id: 'ref29',
    left: 92,
    top: 44,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/ref29.webp`,
  },
  {
    id: 'lia',
    left: 18,
    top: 84,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/lia.webp`,
  },
  {
    id: 'purg2',
    left: 50,
    top: 4,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/purgatory.webp`,
  },
  {
    id: 'aafw',
    left: 82,
    top: 86,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/aafw.webp`,
  },
  {
    id: 'yasmine',
    left: 64,
    top: 90,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/yasmine.jpg`,
  },
  {
    id: 'tiara',
    left: 22,
    top: 14,
    size: 'vx-land-sm',
    ring: 3,
    image: `${V}/tiara.webp`,
  },
  {
    id: 'flux2',
    left: 42,
    top: 92,
    size: 'vx-sm',
    ring: 3,
    image: `${V}/flux.webp`,
  },

  // ═══ RING 4 — Extra content for large monitors (1600px+) ═══
  {
    id: 'nimrit',
    left: 5,
    top: 32,
    size: 'vx-xs',
    ring: 4,
    image: `${V}/nimrit.jpg`,
  },
  {
    id: 'min',
    left: 94,
    top: 62,
    size: 'vx-xs',
    ring: 4,
    image: `${V}/min-wong.jpg`,
  },
  {
    id: 'kuta',
    left: 6,
    top: 76,
    size: 'vx-tiny',
    ring: 4,
    image: `${V}/kuta.webp`,
  },
  {
    id: 'punjab',
    left: 96,
    top: 28,
    size: 'vx-xs',
    ring: 4,
    image: `${V}/punjab.jpg`,
  },
  {
    id: 'maya',
    left: 28,
    top: 95,
    size: 'vx-tiny',
    ring: 4,
    image: `${V}/maya.webp`,
  },
  {
    id: 'mehndi',
    left: 92,
    top: 80,
    size: 'vx-sm',
    ring: 4,
    image: `${V}/mehndi.jpeg`,
  },

  // ═══ RING 5 — Ultrawide (1920px+) — small scattered edge pieces ═══
  {
    id: 'r5-paris1',
    left: 3,
    top: 20,
    size: 'vx-tiny',
    ring: 5,
    image: `${V}/paris1.webp`,
  },
  {
    id: 'r5-wedding',
    left: 97,
    top: 45,
    size: 'vx-tiny',
    ring: 5,
    image: `${V}/wedding.jpg`,
  },
  {
    id: 'r5-india',
    left: 4,
    top: 88,
    size: 'vx-xs',
    ring: 5,
    image: `${V}/india6.webp`,
  },
  {
    id: 'r5-sara',
    left: 96,
    top: 15,
    size: 'vx-tiny',
    ring: 5,
    image: `${V}/sara.webp`,
  },
  {
    id: 'r5-bali',
    left: 85,
    top: 95,
    size: 'vx-tiny',
    ring: 5,
    image: `${V}/eye7.webp`,
  },
  {
    id: 'r5-nancy',
    left: 2,
    top: 55,
    size: 'vx-tiny',
    ring: 5,
    image: `${V}/nancy.webp`,
  },
  {
    id: 'r5-ruger',
    left: 98,
    top: 75,
    size: 'vx-xs',
    ring: 5,
    image: `${V}/ruger.webp`,
  },
  {
    id: 'r5-snakes2',
    left: 48,
    top: 98,
    size: 'vx-tiny',
    ring: 5,
    image: `${V}/snakes2.webp`,
  },
  {
    id: 'r5-office',
    left: 70,
    top: 3,
    size: 'vx-tiny',
    ring: 5,
    image: `${V}/office-aafw.webp`,
  },
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
    <section
      className="vortex-wrap"
      id="gallerySection"
      style={{ marginTop: '-15vh', position: 'relative', zIndex: 10 }}
    >
      <div className="vortex" ref={vortexRef}>
        {vortexItems.map((item) => (
          <VortexItem key={item.id} {...item} />
        ))}
      </div>
    </section>
  )
}
