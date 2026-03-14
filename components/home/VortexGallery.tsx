'use client'

import { useEffect, useRef } from 'react'
import { VortexItem } from './VortexItem'

const V = '/images/vortex'

const vortexItems = [
  // ═══ RING 0 — Core (always visible) ═══
  {
    id: 'crossfire',
    left: 50,
    top: 46,
    size: 'vx-lg',
    ring: 0,
    href: '/direction/crossfire',
    title: 'CROSSFIRE',
    tag: 'Dance Film',
    image: `${V}/crossfire-thumb.webp`,
    imageStyle: 'object-position:center top',
  },
  {
    id: 'swamp',
    left: 41,
    top: 57,
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
    left: 61,
    top: 30,
    size: 'vx-md',
    ring: 0,
    href: '/direction/padani-elle-india',
    title: 'Padani for ELLE',
    tag: 'Fashion Film',
    image: `${V}/padani1.webp`,
  },
  {
    id: 'jiggy',
    left: 33,
    top: 36,
    size: 'vx-sm',
    ring: 0,
    href: '/direction/jiggy-jaya-sftm',
    title: 'Jiggy Jaya x SFTM',
    tag: 'Fashion Film',
    image: `${V}/jiggy.webp`,
  },
  {
    id: 'velvet',
    left: 71,
    top: 40,
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
    top: 71,
    size: 'vx-xs',
    ring: 0,
    image: `${V}/padani2.webp`,
  },

  // ═══ RING 1 — Inner orbit (hidden on phone) ═══
  {
    id: 'itm4l',
    left: 30,
    top: 22,
    size: 'vx-land',
    ring: 1,
    image: `${V}/itm4l.webp`,
  },
  {
    id: 'pam',
    left: 66,
    top: 20,
    size: 'vx-land',
    ring: 1,
    href: '/direction/pam-bali',
    title: 'PAM x Nick Sethi',
    tag: 'Dance Fashion Film',
    image: `${V}/pam-bali.gif`,
    zIndex: 6,
  },
  {
    id: 'oats',
    left: 78,
    top: 52,
    size: 'vx-land-sm',
    ring: 1,
    image: `${V}/oats.webp`,
  },
  {
    id: 'punjab-car',
    left: 23,
    top: 63,
    size: 'vx-land',
    ring: 1,
    image: `${V}/punjab-car.webp`,
  },
  {
    id: 'pravaah1',
    left: 66,
    top: 76,
    size: 'vx-land-sm',
    ring: 1,
    image: `${V}/pravaah1.gif`,
  },
  {
    id: 'cherry',
    left: 20,
    top: 30,
    size: 'vx-sm',
    ring: 1,
    image: `${V}/cherry-chola.webp`,
  },
  {
    id: 'eye1',
    left: 82,
    top: 22,
    size: 'vx-tiny',
    ring: 1,
    image: `${V}/eye4.webp`,
  },
  {
    id: 'pam-nick',
    left: 88,
    top: 36,
    size: 'vx-xs',
    ring: 1,
    image: `${V}/pam-nick.webp`,
  },
  {
    id: 'sabor',
    left: 28,
    top: 75,
    size: 'vx-land',
    ring: 1,
    image: `${V}/sabor-celestial.gif`,
  },

  {
    id: 'carnival',
    left: 56,
    top: 62,
    size: 'vx-sm',
    ring: 1,
    image: `${V}/carnival.webp`,
  },
  {
    id: 'punjab-mirror',
    left: 75,
    top: 42,
    size: 'vx-land-sm',
    ring: 1,
    image: `${V}/punjab-mirror.webp`,
  },

  // ═══ RING 2 — Mid orbit (hidden below 900px) ═══
  {
    id: 'twinkling',
    left: 44,
    top: 18,
    size: 'vx-land-sm',
    ring: 2,
    image: `${V}/twinkling.gif`,
  },
  {
    id: 'brown',
    left: 80,
    top: 67,
    size: 'vx-tall',
    ring: 2,
    image: `${V}/brown-suga.webp`,
  },
  {
    id: 'shysol',
    left: 15,
    top: 46,
    size: 'vx-xs',
    ring: 2,
    image: `${V}/shysol.webp`,
  },
  {
    id: 'donna',
    left: 78,
    top: 20,
    size: 'vx-md',
    ring: 2,
    image: `${V}/donna.webp`,
  },
  {
    id: 'paris-syd-gif',
    left: 20,
    top: 20,
    size: 'vx-land',
    ring: 2,
    image: `${V}/paris-syd.gif`,
  },
  {
    id: 'akshaya',
    left: 90,
    top: 48,
    size: 'vx-xs',
    ring: 2,
    image: `${V}/akshaya.webp`,
  },
  {
    id: 'install',
    left: 12,
    top: 65,
    size: 'vx-land',
    ring: 2,
    image: `${V}/install.webp`,
  },
  {
    id: 'club',
    left: 56,
    top: 18,
    size: 'vx-tiny',
    ring: 2,
    image: `${V}/club13.webp`,
  },
  {
    id: 'flux',
    left: 10,
    top: 30,
    size: 'vx-sm',
    ring: 2,
    image: `${V}/flux.webp`,
  },

  {
    id: 'punjab-blur',
    left: 48,
    top: 82,
    size: 'vx-tiny',
    ring: 2,
    image: `${V}/punjab-blur.webp`,
  },
  {
    id: 'nani-hands',
    left: 86,
    top: 58,
    size: 'vx-tiny',
    ring: 2,
    image: `${V}/nani-hands.webp`,
  },
  {
    id: 'reem-roshan',
    left: 34,
    top: 78,
    size: 'vx-tiny',
    ring: 2,
    image: `${V}/reem-roshan.gif`,
  },

  {
    id: 'mehndi-hand',
    left: 14,
    top: 78,
    size: 'vx-land-sm',
    ring: 2,
    image: `${V}/mehndi-hand.webp`,
  },

  // ═══ RING 3 — Outer orbit (only on 1200px+) ═══
  {
    id: 'purg1',
    left: 90,
    top: 18,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/purgatory.webp`,
  },
  {
    id: 'snakes',
    left: 32,
    top: 84,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/snakes.webp`,
  },
  {
    id: 'westfield',
    left: 36,
    top: 16,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/westfield.webp`,
  },
  {
    id: 'fragile',
    left: 92,
    top: 62,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/fragile.webp`,
  },
  {
    id: 'mia',
    left: 8,
    top: 55,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/mia.webp`,
  },
  {
    id: 'elle-ngo',
    left: 16,
    top: 18,
    size: 'vx-sm',
    ring: 3,
    image: `${V}/elle-ngo.webp`,
  },
  {
    id: 'ref29',
    left: 94,
    top: 38,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/ref29.webp`,
  },
  {
    id: 'aafw',
    left: 86,
    top: 82,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/aafw.webp`,
  },
  {
    id: 'yasmine',
    left: 70,
    top: 86,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/yasmine.webp`,
  },
  {
    id: 'tiara',
    left: 20,
    top: 16,
    size: 'vx-land-sm',
    ring: 3,
    image: `${V}/tiara.webp`,
  },

  // ═══ RING 4 — Extra content for large monitors (1600px+) ═══
  {
    id: 'nimrit',
    left: 6,
    top: 26,
    size: 'vx-sm',
    ring: 4,
    image: `${V}/nimrit.webp`,
  },
  {
    id: 'jack-garcia',
    left: 8,
    top: 72,
    size: 'vx-tiny',
    ring: 4,
    image: `${V}/jack-garcia.webp`,
  },
  {
    id: 'punjab',
    left: 96,
    top: 22,
    size: 'vx-tiny',
    ring: 4,
    image: `${V}/punjab.webp`,
  },
  {
    id: 'mehndi',
    left: 92,
    top: 76,
    size: 'vx-land-sm',
    ring: 4,
    image: `${V}/mehndi.webp`,
  },

  // ═══ RING 5 — Ultrawide (1920px+) — small scattered edge pieces ═══
  {
    id: 'r5-wedding',
    left: 97,
    top: 40,
    size: 'vx-tiny',
    ring: 5,
    image: `${V}/wedding.webp`,
  },
  {
    id: 'r5-india',
    left: 5,
    top: 82,
    size: 'vx-sm',
    ring: 5,
    image: `${V}/india6.webp`,
  },
  {
    id: 'r5-sara',
    left: 96,
    top: 16,
    size: 'vx-tiny',
    ring: 5,
    image: `${V}/sara.webp`,
  },
  {
    id: 'r5-loyle',
    left: 98,
    top: 68,
    size: 'vx-xs',
    ring: 5,
    image: `${V}/loyle-carner.webp`,
  },
]

export function VortexGallery() {
  const vortexRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    let deg = 0
    let last = performance.now()
    const speed = 360 / 180000 // One rotation per 180 seconds (slower)
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
