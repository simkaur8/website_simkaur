'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { VortexItem } from './VortexItem'

const V = '/images/vortex'

/*
 * Mobile layout: circular disc with items packed tightly.
 * All positions within ~30% radius of center (50,50) so nothing
 * clips against the border-radius: 50% circle. Heavy overlap in core.
 */
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
    mobileLeft: 50,
    mobileTop: 48,
    mobileSize: 'vx-mob-xl',
  },
  {
    id: 'elle',
    left: 58,
    top: 38,
    size: 'vx-land',
    ring: 0,
    href: '/direction/padani-elle-india',
    title: 'Padani for ELLE',
    tag: 'Fashion Film',
    image: `${V}/padani1.webp`,
    mobilePriority: true,
    mobileLeft: 64,
    mobileTop: 30,
    mobileSize: 'vx-mob-md',
  },
  {
    id: 'brown-suga-press',
    left: 42,
    top: 56,
    size: 'vx-sm',
    ring: 0,
    image: `${V}/brown-suga-press.webp`,
    mobileLeft: 52,
    mobileTop: 62,
    mobileSize: 'vx-mob-md',
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
    mobileLeft: 32,
    mobileTop: 44,
    mobileSize: 'vx-mob-md-tall',
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
    aspectOverride: '4/3',
    mobilePriority: true,
    mobileLeft: 62,
    mobileTop: 46,
    mobileSize: 'vx-mob-lg',
    mobileAspect: '4/3',
  },
  {
    id: 'still2',
    left: 53,
    top: 58,
    size: 'vx-xs',
    ring: 0,
    image: `${V}/padani2.webp`,
    mobileLeft: 40,
    mobileTop: 58,
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
    aspectOverride: '4/3',
    mobileLeft: 52,
    mobileTop: 28,
    mobileSize: 'vx-mob-md',
    mobileAspect: '4/3',
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
    mobileLeft: 42,
    mobileTop: 36,
    mobileSize: 'vx-mob-lg',
  },
  {
    id: 'oats',
    left: 72,
    top: 56,
    size: 'vx-land-sm',
    ring: 1,
    image: `${V}/oats.webp`,
    mobileLeft: 68,
    mobileTop: 52,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'punjab-car',
    left: 30,
    top: 62,
    size: 'vx-land',
    ring: 1,
    image: `${V}/punjab-car.webp`,
    mobileLeft: 28,
    mobileTop: 38,
    mobileSize: 'vx-mob-md',
  },
  {
    id: 'pravaah1',
    left: 64,
    top: 68,
    size: 'vx-land-sm',
    ring: 1,
    image: `${V}/pravaah-thumb.webp`,
    mobileLeft: 60,
    mobileTop: 66,
    mobileSize: 'vx-mob-particle',
    mobileAspect: '4/3',
  },
  {
    id: 'cherry',
    left: 30,
    top: 46,
    size: 'vx-sm',
    ring: 1,
    image: `${V}/cherry-chola.webp`,
    mobileLeft: 46,
    mobileTop: 54,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'cherry2',
    left: 22,
    top: 54,
    size: 'vx-land-sm',
    ring: 1,
    image: `${V}/cherry-chola2.webp`,
    mobileLeft: 34,
    mobileTop: 56,
    mobileSize: 'vx-mob-md',
  },
  {
    id: 'eye1',
    left: 73,
    top: 38,
    size: 'vx-tiny',
    ring: 1,
    image: `${V}/eye4.webp`,
    mobileLeft: 68,
    mobileTop: 36,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'pam-nick',
    left: 74,
    top: 48,
    size: 'vx-xs',
    ring: 1,
    image: `${V}/pam-nick.webp`,
    mobileLeft: 64,
    mobileTop: 40,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'sabor',
    left: 44,
    top: 70,
    size: 'vx-land',
    ring: 1,
    image: `${V}/sabor-celestial.gif`,
    mobileLeft: 46,
    mobileTop: 64,
    mobileSize: 'vx-mob-md',
    mobileAspect: '16/10',
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
    mobileLeft: 55,
    mobileTop: 22,
    mobileSize: 'vx-mob-md',
  },
  {
    id: 'brown',
    left: 78,
    top: 62,
    size: 'vx-tall',
    ring: 2,
    image: `${V}/brown-suga.webp`,
    mobileLeft: 66,
    mobileTop: 58,
    mobileSize: 'vx-mob-md-tall',
  },
  {
    id: 'shysol',
    left: 20,
    top: 52,
    size: 'vx-xs',
    ring: 2,
    image: `${V}/shysol.webp`,
    mobileLeft: 52,
    mobileTop: 50,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'donna',
    left: 76,
    top: 28,
    size: 'vx-md',
    ring: 2,
    image: `${V}/donna.webp`,
    mobileLeft: 55,
    mobileTop: 40,
    mobileSize: 'vx-mob-md-tall',
  },
  {
    id: 'paris-syd-gif',
    left: 22,
    top: 32,
    size: 'vx-land',
    ring: 2,
    image: `${V}/paris-syd.gif`,
    mobileLeft: 30,
    mobileTop: 28,
    mobileSize: 'vx-mob-md',
    mobileAspect: '16/10',
  },
  {
    id: 'akshaya',
    left: 82,
    top: 48,
    size: 'vx-xs',
    ring: 2,
    image: `${V}/akshaya.webp`,
    mobileLeft: 72,
    mobileTop: 44,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'install',
    left: 20,
    top: 68,
    size: 'vx-land',
    ring: 2,
    image: `${V}/install.webp`,
    mobileLeft: 48,
    mobileTop: 72,
    mobileSize: 'vx-mob-md',
    mobileAspect: '16/10',
  },
  {
    id: 'club',
    left: 62,
    top: 22,
    size: 'vx-tiny',
    ring: 2,
    image: `${V}/club13.webp`,
    mobileLeft: 50,
    mobileTop: 20,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'flux',
    left: 18,
    top: 40,
    size: 'vx-sm',
    ring: 2,
    image: `${V}/flux.webp`,
    mobileLeft: 44,
    mobileTop: 52,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'punjab-blur',
    left: 56,
    top: 78,
    size: 'vx-land-sm',
    ring: 2,
    image: `${V}/punjab-blur.webp`,
    mobileLeft: 56,
    mobileTop: 72,
    mobileSize: 'vx-mob-particle',
    mobileAspect: '16/10',
  },
  {
    id: 'nani-hands',
    left: 80,
    top: 55,
    size: 'vx-tiny',
    ring: 2,
    image: `${V}/nani-hands.webp`,
    mobileLeft: 66,
    mobileTop: 54,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'reem-roshan',
    left: 30,
    top: 76,
    size: 'vx-land-sm',
    ring: 2,
    image: `${V}/reem-roshan.gif`,
    mobileLeft: 42,
    mobileTop: 70,
    mobileSize: 'vx-mob-md',
    mobileAspect: '16/10',
  },
  {
    id: 'mehndi-hand',
    left: 24,
    top: 74,
    size: 'vx-land-sm',
    ring: 2,
    image: `${V}/mehndi-hand.webp`,
    mobilePriority: true,
    mobileLeft: 34,
    mobileTop: 66,
    mobileSize: 'vx-mob-md',
  },

  // ═══ RING 3 — Outer orbit ═══
  {
    id: 'purg1',
    left: 84,
    top: 27,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/purgatory.webp`,
    mobileLeft: 66,
    mobileTop: 26,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'snakes',
    left: 40,
    top: 84,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/snakes.webp`,
    mobileLeft: 50,
    mobileTop: 76,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'fragile',
    left: 86,
    top: 58,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/fragile.webp`,
    mobileLeft: 70,
    mobileTop: 42,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'mia',
    left: 12,
    top: 58,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/mia.webp`,
    mobileLeft: 28,
    mobileTop: 62,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'elle-ngo',
    left: 16,
    top: 28,
    size: 'vx-sm',
    ring: 3,
    image: `${V}/elle-ngo.webp`,
    mobileLeft: 28,
    mobileTop: 30,
    mobileSize: 'vx-mob-md',
  },
  {
    id: 'ref29',
    left: 88,
    top: 42,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/ref29.webp`,
    mobileLeft: 54,
    mobileTop: 56,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'aafw',
    left: 80,
    top: 74,
    size: 'vx-tiny',
    ring: 3,
    image: `${V}/aafw.webp`,
    mobileLeft: 62,
    mobileTop: 70,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'yasmine',
    left: 68,
    top: 82,
    size: 'vx-xs',
    ring: 3,
    image: `${V}/yasmine.webp`,
    mobileLeft: 60,
    mobileTop: 74,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'tiara',
    left: 24,
    top: 24,
    size: 'vx-land-sm',
    ring: 3,
    image: `${V}/tiara.webp`,
    mobileLeft: 38,
    mobileTop: 24,
    mobileSize: 'vx-mob-md',
    mobileAspect: '16/10',
  },

  // ═══ RING 4 — Large monitors (1600px+) ═══
  {
    id: 'nimrit',
    left: 12,
    top: 36,
    size: 'vx-sm',
    ring: 4,
    image: `${V}/nimrit.webp`,
    mobileLeft: 32,
    mobileTop: 24,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'jack-garcia',
    left: 14,
    top: 72,
    size: 'vx-tiny',
    ring: 4,
    image: `${V}/jack-garcia.webp`,
    mobileLeft: 32,
    mobileTop: 68,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'punjab',
    left: 86,
    top: 30,
    size: 'vx-tiny',
    ring: 4,
    image: `${V}/punjab.webp`,
    mobileLeft: 68,
    mobileTop: 28,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'iph-sari',
    left: 54,
    top: 14,
    size: 'vx-tiny',
    ring: 4,
    image: `${V}/iph-sari.webp`,
    mobileLeft: 44,
    mobileTop: 24,
    mobileSize: 'vx-mob-particle',
  },

  // ═══ RING 5 — Ultrawide (1920px+) ═══
  {
    id: 'r5-wedding',
    left: 90,
    top: 46,
    size: 'vx-tiny',
    ring: 5,
    image: `${V}/wedding.webp`,
    mobileLeft: 48,
    mobileTop: 44,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'r5-india',
    left: 10,
    top: 78,
    size: 'vx-sm',
    ring: 5,
    image: `${V}/india6.webp`,
    mobileLeft: 36,
    mobileTop: 74,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'r5-sara',
    left: 88,
    top: 24,
    size: 'vx-tiny',
    ring: 5,
    image: `${V}/sara.webp`,
    mobileLeft: 62,
    mobileTop: 28,
    mobileSize: 'vx-mob-particle',
  },
  {
    id: 'r5-loyle',
    left: 88,
    top: 68,
    size: 'vx-xs',
    ring: 5,
    image: `${V}/loyle-carner.webp`,
    mobileLeft: 72,
    mobileTop: 60,
    mobileSize: 'vx-mob-particle',
  },
]

const GOLDEN_ANGLE = 137.508 * (Math.PI / 180)

/**
 * Fermat sunflower spiral — places items at golden-angle increments
 * with radius proportional to sqrt(index). Items near the start of the
 * array land at the center; later items fan outward.
 * Z-indices alternate to create a weaving/overlapping effect.
 */
function computeSpiral(count: number, maxR: number) {
  const positions: Array<{ left: number; top: number; z: number }> = []
  for (let i = 0; i < count; i++) {
    if (i === 0) {
      positions.push({ left: 50, top: 50, z: 10 })
      continue
    }
    const angle = i * GOLDEN_ANGLE
    const r = maxR * Math.sqrt(i / (count - 1))
    const left = 50 + r * Math.cos(angle)
    const top = 50 + r * Math.sin(angle)
    // Weaving z-index: center items stay prominent, others alternate high/low
    // Creates over/under overlap as images spiral inward
    const z = i < 6 ? (i % 2 === 0 ? 10 : 7) : i % 2 === 0 ? 5 : 1
    positions.push({ left, top, z })
  }
  return positions
}

export function VortexGallery() {
  const vortexRef = useRef<HTMLDivElement>(null)
  const [slowConnection, setSlowConnection] = useState(false)

  const subscribe = useCallback((cb: () => void) => {
    const mq = window.matchMedia('(max-width: 599px)')
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  }, [])
  const getSnapshot = useCallback(() => window.matchMedia('(max-width: 599px)').matches, [])
  const getServerSnapshot = useCallback(() => false, [])
  const isMobile = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  // Detect slow connections — swap GIFs for static webp fallbacks
  useEffect(() => {
    const conn = (
      navigator as Navigator & {
        connection?: {
          effectiveType: string
          addEventListener: typeof addEventListener
          removeEventListener: typeof removeEventListener
        }
      }
    ).connection
    if (!conn) return
    const check = () => {
      const t = conn.effectiveType
      setSlowConnection(t === '2g' || t === 'slow-2g' || t === '3g')
    }
    check()
    conn.addEventListener('change', check)
    return () => conn.removeEventListener('change', check)
  }, [])

  // Compute spiral positions — tighter on mobile to fill the oval densely
  const spiral = useMemo(() => computeSpiral(vortexItems.length, isMobile ? 25 : 42), [isMobile])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const mobile = window.matchMedia('(max-width: 599px)').matches

    let deg = 0
    let last = performance.now()
    const speed = 360 / 320000 // One rotation per ~5.3 minutes
    let rafId: number

    function tick(now: number) {
      deg += speed * (now - last)
      last = now
      if (deg >= 360) deg -= 360

      if (vortexRef.current) {
        vortexRef.current.style.transform = mobile
          ? `rotateX(8deg) rotate(${deg}deg)`
          : `rotate(${deg}deg)`
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
      style={{ position: 'relative', zIndex: 10 }}
      data-vortex-section
    >
      <div className="vortex" ref={vortexRef}>
        {vortexItems.map((item, i) => {
          const pos = spiral[i]
          const imageSrc =
            slowConnection && item.image.endsWith('.gif')
              ? item.image.replace('.gif', '-static.webp')
              : item.image
          return (
            <VortexItem
              key={item.id}
              {...item}
              image={imageSrc}
              left={pos.left}
              top={pos.top}
              zIndex={pos.z}
              size={isMobile && item.mobileSize ? item.mobileSize : item.size}
              aspectOverride={
                isMobile && item.mobileAspect ? item.mobileAspect : item.aspectOverride
              }
            />
          )
        })}
      </div>
    </section>
  )
}
