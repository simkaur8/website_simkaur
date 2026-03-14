'use client'

import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
import { VortexItem } from './VortexItem'

const V = '/images/vortex'

const vortexItems = [
  // ═══ RING 0 — Core (always visible) ═══
  {
    id: 'crossfire',
    left: 50,
    top: 48,
    size: 'vx-lg',
    ring: 0,
    href: '/direction/crossfire',
    title: 'CROSSFIRE',
    tag: 'Dance Film',
    image: `${V}/crossfire-thumb.webp`,
    imageStyle: 'object-position:center top',
    mobilePriority: true,
    mobileLeft: 48,
    mobileTop: 42,
    mobileSize: 'vx-mob-xl',
  },
  {
    id: 'swamp',
    left: 42,
    top: 54,
    size: 'vx-sm',
    ring: 0,
    href: '/direction/swamp',
    title: 'SWAMP',
    tag: 'Dance Film',
    image: `${V}/swamp.webp`,
    under: true,
    mobileLeft: 62,
    mobileTop: 68,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'elle',
    left: 58,
    top: 38,
    size: 'vx-md',
    ring: 0,
    href: '/direction/padani-elle-india',
    title: 'Padani for ELLE',
    tag: 'Fashion Film',
    image: `${V}/padani1.webp`,
    mobileLeft: 78,
    mobileTop: 32,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'jiggy',
    left: 39,
    top: 40,
    size: 'vx-sm',
    ring: 0,
    href: '/direction/jiggy-jaya-sftm',
    title: 'Jiggy Jaya x SFTM',
    tag: 'Fashion Film',
    image: `${V}/jiggy.webp`,
    mobilePriority: true,
    mobileLeft: 28,
    mobileTop: 58,
    mobileSize: 'vx-mob-md',
  },
  {
    id: 'velvet',
    left: 63,
    top: 46,
    size: 'vx-land',
    ring: 0,
    href: '/direction/velvet-skin',
    title: 'Velvet Skin',
    tag: 'Music Video',
    image: `${V}/velvet-skin.webp`,
    mobilePriority: true,
    mobileLeft: 68,
    mobileTop: 50,
    mobileSize: 'vx-mob-lg',
  },
  {
    id: 'still2',
    left: 53,
    top: 58,
    size: 'vx-xs',
    ring: 0,
    image: `${V}/padani2.webp`,
    mobileLeft: 40,
    mobileTop: 75,
    mobileSize: 'vx-mob-particle',
  },

  // ═══ RING 1 — Inner orbit ═══
  {
    id: 'itm4l',
    left: 34,
    top: 30,
    size: 'vx-land',
    ring: 1,
    image: `${V}/itm4l.webp`,
    mobileLeft: 22,
    mobileTop: 28,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'pam',
    left: 64,
    top: 28,
    size: 'vx-land',
    ring: 1,
    href: '/direction/pam-bali',
    title: 'PAM x Nick Sethi',
    tag: 'Dance Fashion Film',
    image: `${V}/pam-bali.gif`,
    zIndex: 6,
    mobilePriority: true,
    mobileLeft: 32,
    mobileTop: 28,
    mobileSize: 'vx-mob-lg',
  },
  {
    id: 'oats',
    left: 72,
    top: 56,
    size: 'vx-land-sm',
    ring: 1,
    image: `${V}/oats.webp`,
    mobileLeft: 85,
    mobileTop: 60,
    mobileSize: 'vx-mob-dot',
  },
  {
    id: 'punjab-car',
    left: 28,
    top: 62,
    size: 'vx-land',
    ring: 1,
    image: `${V}/punjab-car.webp`,
    mobileLeft: 12,
    mobileTop: 45,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'pravaah1',
    left: 64,
    top: 68,
    size: 'vx-land-sm',
    ring: 1,
    image: `${V}/pravaah1.gif`,
    mobileLeft: 75,
    mobileTop: 78,
    mobileSize: 'vx-mob-dot',
  },
  {
    id: 'cherry',
    left: 28,
    top: 46,
    size: 'vx-sm',
    ring: 1,
    image: `${V}/cherry-chola.webp`,
    mobileLeft: 15,
    mobileTop: 68,
    mobileSize: 'vx-mob-dot',
  },
  {
    id: 'eye1',
    left: 74,
    top: 36,
    size: 'vx-tiny',
    ring: 1,
    image: `${V}/eye4.webp`,
    mobileLeft: 88,
    mobileTop: 42,
    mobileSize: 'vx-mob-dot',
  },
  {
    id: 'pam-nick',
    left: 76,
    top: 48,
    size: 'vx-xs',
    ring: 1,
    image: `${V}/pam-nick.webp`,
    mobileLeft: 82,
    mobileTop: 25,
    mobileSize: 'vx-mob-dot',
  },
  {
    id: 'sabor',
    left: 44,
    top: 70,
    size: 'vx-land',
    ring: 1,
    image: `${V}/sabor-celestial.gif`,
    mobileLeft: 55,
    mobileTop: 82,
    mobileSize: 'vx-mob-particle',
  },

  // ═══ RING 2 — Mid orbit ═══
  {
    id: 'twinkling',
    left: 42,
    top: 22,
    size: 'vx-land-sm',
    ring: 2,
    image: `${V}/twinkling.gif`,
    mobilePriority: true,
    mobileLeft: 60,
    mobileTop: 22,
    mobileSize: 'vx-mob-md',
  },
  {
    id: 'brown',
    left: 84,
    top: 64,
    size: 'vx-tall',
    ring: 2,
    image: `${V}/brown-suga.webp`,
  },
  {
    id: 'shysol',
    left: 14,
    top: 54,
    size: 'vx-xs',
    ring: 2,
    image: `${V}/shysol.webp`,
  },
  {
    id: 'donna',
    left: 82,
    top: 24,
    size: 'vx-md',
    ring: 2,
    image: `${V}/donna.webp`,
  },
  {
    id: 'paris-syd-gif',
    left: 18,
    top: 30,
    size: 'vx-land',
    ring: 2,
    image: `${V}/paris-syd.gif`,
  },
  {
    id: 'akshaya',
    left: 88,
    top: 48,
    size: 'vx-xs',
    ring: 2,
    image: `${V}/akshaya.webp`,
  },
  {
    id: 'install',
    left: 12,
    top: 72,
    size: 'vx-land',
    ring: 2,
    image: `${V}/install.webp`,
  },
  {
    id: 'club',
    left: 62,
    top: 22,
    size: 'vx-tiny',
    ring: 2,
    image: `${V}/club13.webp`,
  },
  {
    id: 'flux',
    left: 10,
    top: 38,
    size: 'vx-sm',
    ring: 2,
    image: `${V}/flux.webp`,
  },
  {
    id: 'punjab-blur',
    left: 56,
    top: 80,
    size: 'vx-land-sm',
    ring: 2,
    image: `${V}/punjab-blur.webp`,
  },
  {
    id: 'nani-hands',
    left: 86,
    top: 56,
    size: 'vx-tiny',
    ring: 2,
    image: `${V}/nani-hands.webp`,
  },
  {
    id: 'reem-roshan',
    left: 26,
    top: 80,
    size: 'vx-land-sm',
    ring: 2,
    image: `${V}/reem-roshan.gif`,
  },
  {
    id: 'mehndi-hand',
    left: 14,
    top: 82,
    size: 'vx-land-sm',
    ring: 2,
    image: `${V}/mehndi-hand.webp`,
    mobilePriority: true,
    mobileLeft: 18,
    mobileTop: 80,
    mobileSize: 'vx-mob-md',
  },

  // ═══ RING 3 — Outer orbit (only on 1200px+) ═══
  {
    id: 'purg1',
    left: 92,
    top: 22,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/purgatory.webp`,
  },
  {
    id: 'snakes',
    left: 38,
    top: 86,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/snakes.webp`,
  },
  {
    id: 'fragile',
    left: 92,
    top: 60,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/fragile.webp`,
  },
  {
    id: 'mia',
    left: 6,
    top: 62,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/mia.webp`,
  },
  {
    id: 'elle-ngo',
    left: 10,
    top: 24,
    size: 'vx-sm',
    ring: 3,
    image: `${V}/elle-ngo.webp`,
  },
  {
    id: 'ref29',
    left: 94,
    top: 40,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/ref29.webp`,
  },
  {
    id: 'aafw',
    left: 88,
    top: 80,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/aafw.webp`,
  },
  {
    id: 'yasmine',
    left: 72,
    top: 86,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/yasmine.webp`,
  },
  {
    id: 'tiara',
    left: 20,
    top: 20,
    size: 'vx-land-sm',
    ring: 3,
    image: `${V}/tiara.webp`,
  },

  // ═══ RING 4 — Extra content for large monitors (1600px+) ═══
  {
    id: 'nimrit',
    left: 4,
    top: 32,
    size: 'vx-sm',
    ring: 4,
    image: `${V}/nimrit.webp`,
  },
  {
    id: 'jack-garcia',
    left: 6,
    top: 76,
    size: 'vx-tiny',
    ring: 4,
    image: `${V}/jack-garcia.webp`,
  },
  {
    id: 'punjab',
    left: 94,
    top: 24,
    size: 'vx-tiny',
    ring: 4,
    image: `${V}/punjab.webp`,
  },
  {
    id: 'iph-sari',
    left: 54,
    top: 20,
    size: 'vx-tiny',
    ring: 4,
    image: `${V}/iph-sari.webp`,
  },

  // ═══ RING 5 — Ultrawide (1920px+) — small scattered edge pieces ═══
  {
    id: 'r5-wedding',
    left: 96,
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
    top: 20,
    size: 'vx-tiny',
    ring: 5,
    image: `${V}/sara.webp`,
  },
  {
    id: 'r5-loyle',
    left: 96,
    top: 72,
    size: 'vx-xs',
    ring: 5,
    image: `${V}/loyle-carner.webp`,
  },
]

export function VortexGallery() {
  const vortexRef = useRef<HTMLDivElement>(null)

  const subscribe = useCallback((cb: () => void) => {
    const mq = window.matchMedia('(max-width: 599px)')
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  }, [])
  const getSnapshot = useCallback(() => window.matchMedia('(max-width: 599px)').matches, [])
  const getServerSnapshot = useCallback(() => false, [])
  const isMobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

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

  // On mobile, only render items that have mobile positions defined
  const items = isMobile ? vortexItems.filter((item) => item.mobileLeft != null) : vortexItems

  return (
    <section
      className="vortex-wrap"
      id="gallerySection"
      style={{ marginTop: '-15vh', position: 'relative', zIndex: 10 }}
    >
      <div className="vortex" ref={vortexRef}>
        {items.map((item) => (
          <VortexItem
            key={item.id}
            {...item}
            left={isMobile && item.mobileLeft != null ? item.mobileLeft : item.left}
            top={isMobile && item.mobileTop != null ? item.mobileTop : item.top}
            size={isMobile && item.mobileSize ? item.mobileSize : item.size}
          />
        ))}
      </div>
    </section>
  )
}
