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
    left: 38,
    top: 58,
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
    left: 62,
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
    left: 34,
    top: 35,
    size: 'vx-sm',
    ring: 0,
    href: '/direction/jiggy-jaya-sftm',
    title: 'Jiggy Jaya x SFTM',
    tag: 'Fashion Film',
    image: `${V}/jiggy.webp`,
  },
  {
    id: 'velvet',
    left: 70,
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
    left: 55,
    top: 64,
    size: 'vx-xs',
    ring: 0,
    image: `${V}/padani2.webp`,
  },

  // ═══ RING 1 — Inner orbit (hidden on phone) ═══
  {
    id: 'itm4l',
    left: 28,
    top: 22,
    size: 'vx-land',
    ring: 1,
    image: `${V}/itm4l.webp`,
  },
  {
    id: 'pam',
    left: 64,
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
    left: 80,
    top: 55,
    size: 'vx-land-sm',
    ring: 1,
    image: `${V}/oats.webp`,
  },
  {
    id: 'punjab-car',
    left: 22,
    top: 66,
    size: 'vx-land',
    ring: 1,
    image: `${V}/punjab-car.webp`,
  },
  {
    id: 'pravaah1',
    left: 68,
    top: 74,
    size: 'vx-land-sm',
    ring: 1,
    image: `${V}/pravaah1.gif`,
  },
  {
    id: 'cherry',
    left: 18,
    top: 40,
    size: 'vx-sm',
    ring: 1,
    image: `${V}/cherry-chola.webp`,
  },
  {
    id: 'eye1',
    left: 84,
    top: 26,
    size: 'vx-tiny',
    ring: 1,
    image: `${V}/eye4.webp`,
  },
  {
    id: 'pam-nick',
    left: 86,
    top: 40,
    size: 'vx-xs',
    ring: 1,
    image: `${V}/pam-nick.webp`,
  },
  {
    id: 'sabor',
    left: 40,
    top: 78,
    size: 'vx-land',
    ring: 1,
    image: `${V}/sabor-celestial.gif`,
  },
  {
    id: 'punjab-mirror',
    left: 78,
    top: 36,
    size: 'vx-land-sm',
    ring: 1,
    image: `${V}/punjab-mirror.webp`,
  },

  // ═══ RING 2 — Mid orbit (hidden below 900px) ═══
  {
    id: 'twinkling',
    left: 42,
    top: 18,
    size: 'vx-land-sm',
    ring: 2,
    image: `${V}/twinkling.gif`,
  },
  {
    id: 'brown',
    left: 84,
    top: 68,
    size: 'vx-tall',
    ring: 2,
    image: `${V}/brown-suga.webp`,
  },
  {
    id: 'shysol',
    left: 12,
    top: 52,
    size: 'vx-xs',
    ring: 2,
    image: `${V}/shysol.webp`,
  },
  {
    id: 'donna',
    left: 82,
    top: 20,
    size: 'vx-md',
    ring: 2,
    image: `${V}/donna.webp`,
  },
  {
    id: 'paris-syd-gif',
    left: 16,
    top: 22,
    size: 'vx-land',
    ring: 2,
    image: `${V}/paris-syd.gif`,
  },
  {
    id: 'akshaya',
    left: 92,
    top: 50,
    size: 'vx-xs',
    ring: 2,
    image: `${V}/akshaya.webp`,
  },
  {
    id: 'install',
    left: 10,
    top: 72,
    size: 'vx-land',
    ring: 2,
    image: `${V}/install.webp`,
  },
  {
    id: 'club',
    left: 58,
    top: 16,
    size: 'vx-tiny',
    ring: 2,
    image: `${V}/club13.webp`,
  },
  {
    id: 'flux',
    left: 8,
    top: 34,
    size: 'vx-sm',
    ring: 2,
    image: `${V}/flux.webp`,
  },
  {
    id: 'punjab-blur',
    left: 54,
    top: 84,
    size: 'vx-tiny',
    ring: 2,
    image: `${V}/punjab-blur.webp`,
  },
  {
    id: 'nani-hands',
    left: 90,
    top: 60,
    size: 'vx-tiny',
    ring: 2,
    image: `${V}/nani-hands.webp`,
  },
  {
    id: 'reem-roshan',
    left: 26,
    top: 82,
    size: 'vx-land-sm',
    ring: 2,
    image: `${V}/reem-roshan.gif`,
  },
  {
    id: 'mehndi-hand',
    left: 14,
    top: 84,
    size: 'vx-land-sm',
    ring: 2,
    image: `${V}/mehndi-hand.webp`,
  },

  // ═══ RING 3 — Outer orbit (only on 1200px+) ═══
  {
    id: 'purg1',
    left: 92,
    top: 18,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/purgatory.webp`,
  },
  {
    id: 'snakes',
    left: 38,
    top: 88,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/snakes.webp`,
  },
  {
    id: 'westfield',
    left: 32,
    top: 16,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/westfield.webp`,
  },
  {
    id: 'fragile',
    left: 94,
    top: 64,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/fragile.webp`,
  },
  {
    id: 'mia',
    left: 6,
    top: 58,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/mia.webp`,
  },
  {
    id: 'elle-ngo',
    left: 10,
    top: 20,
    size: 'vx-sm',
    ring: 3,
    image: `${V}/elle-ngo.webp`,
  },
  {
    id: 'ref29',
    left: 94,
    top: 42,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/ref29.webp`,
  },
  {
    id: 'aafw',
    left: 88,
    top: 84,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/aafw.webp`,
  },
  {
    id: 'yasmine',
    left: 72,
    top: 88,
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
  {
    id: 'iph-diwali',
    left: 52,
    top: 90,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/iph-diwali.webp`,
  },
  {
    id: 'iph-bts',
    left: 6,
    top: 44,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/iph-bts.webp`,
  },

  // ═══ RING 4 — Extra content for large monitors (1600px+) ═══
  {
    id: 'nimrit',
    left: 4,
    top: 28,
    size: 'vx-sm',
    ring: 4,
    image: `${V}/nimrit.webp`,
  },
  {
    id: 'jack-garcia',
    left: 6,
    top: 74,
    size: 'vx-tiny',
    ring: 4,
    image: `${V}/jack-garcia.webp`,
  },
  {
    id: 'punjab',
    left: 96,
    top: 24,
    size: 'vx-tiny',
    ring: 4,
    image: `${V}/punjab.webp`,
  },
  {
    id: 'iph-sari',
    left: 56,
    top: 14,
    size: 'vx-tiny',
    ring: 4,
    image: `${V}/iph-sari.webp`,
  },
  {
    id: 'iph-cards',
    left: 96,
    top: 56,
    size: 'vx-tiny',
    ring: 4,
    image: `${V}/iph-cards.webp`,
  },
  {
    id: 'iph-nani',
    left: 62,
    top: 92,
    size: 'vx-tiny',
    ring: 4,
    image: `${V}/iph-nani.webp`,
  },

  // ═══ RING 5 — Ultrawide (1920px+) — small scattered edge pieces ═══
  {
    id: 'r5-wedding',
    left: 97,
    top: 44,
    size: 'vx-tiny',
    ring: 5,
    image: `${V}/wedding.webp`,
  },
  {
    id: 'r5-india',
    left: 4,
    top: 84,
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
    top: 70,
    size: 'vx-xs',
    ring: 5,
    image: `${V}/loyle-carner.webp`,
  },
  {
    id: 'iph-writing',
    left: 4,
    top: 16,
    size: 'vx-tiny',
    ring: 5,
    image: `${V}/iph-writing.webp`,
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
