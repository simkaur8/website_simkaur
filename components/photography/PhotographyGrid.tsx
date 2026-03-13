'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const P = '/images/photography'

interface Photo {
  src: string
  title: string
  category: 'fashion' | 'portraits' | 'event' | 'life'
  curated?: boolean
}

const photos: Photo[] = [
  // ═══ CURATED ALL VIEW — Priority order ═══
  {
    src: `${P}/fashion/westfield-campaign.webp`,
    title: 'Westfield Australia Diwali Campaign',
    category: 'fashion',
    curated: true,
  },
  {
    src: `${P}/fashion/modibodi.webp`,
    title: 'ModiBodi Campaign',
    category: 'fashion',
    curated: true,
  },
  {
    src: `${P}/fashion/pam-nick-sethi.webp`,
    title: 'PAM x Nick Sethi',
    category: 'fashion',
    curated: true,
  },
  {
    src: `${P}/fashion/donna-bertram.webp`,
    title: 'Donna Bertram',
    category: 'fashion',
    curated: true,
  },
  {
    src: `${P}/portraits/loyle-carner.webp`,
    title: 'Loyle Carner',
    category: 'portraits',
    curated: true,
  },
  {
    src: `${P}/fashion/ref29-parra1.webp`,
    title: 'Refinery29 Parramatta',
    category: 'fashion',
    curated: true,
  },
  { src: `${P}/fashion/purgatory2.webp`, title: 'Purgatory', category: 'fashion', curated: true },
  {
    src: `${P}/fashion/ref29-mtdruitt1.webp`,
    title: 'Refinery29 Mt Druitt',
    category: 'fashion',
    curated: true,
  },
  {
    src: `${P}/fashion/snakes-shanti.webp`,
    title: 'Snakes and Shanti',
    category: 'fashion',
    curated: true,
  },
  {
    src: `${P}/portraits/cherry-chola2.webp`,
    title: 'Cherry Chola',
    category: 'portraits',
    curated: true,
  },
  { src: `${P}/portraits/elle-ngo.webp`, title: 'Elle Ngo', category: 'portraits', curated: true },
  {
    src: `${P}/portraits/nancy-dennis.webp`,
    title: 'Nancy Dennis',
    category: 'portraits',
    curated: true,
  },
  {
    src: `${P}/portraits/nimrit-kaur.webp`,
    title: 'Nimrit Kaur',
    category: 'portraits',
    curated: true,
  },
  {
    src: `${P}/portraits/jack-garcia.webp`,
    title: 'Jack Garcia',
    category: 'portraits',
    curated: true,
  },
  { src: `${P}/fashion/maya.webp`, title: 'Maya', category: 'portraits', curated: true },
  { src: `${P}/life/paris-2025-1.webp`, title: 'Paris, 2025', category: 'life', curated: true },
  { src: `${P}/life/paris-2025-2.webp`, title: 'Paris, 2025', category: 'life', curated: true },
  { src: `${P}/life/india-2019-6.webp`, title: 'India, 2019', category: 'life', curated: true },
  {
    src: `${P}/life/3rd-eye4.webp`,
    title: 'Colombia, Sri Lanka, Bali, 2024',
    category: 'life',
    curated: true,
  },
  { src: `${P}/life/india-2019-2.webp`, title: 'India, 2019', category: 'life', curated: true },

  // ═══ FASHION ADDITIONAL ═══
  { src: `${P}/fashion/ref29-mtdruitt2.webp`, title: 'Refinery29 Mt Druitt', category: 'fashion' },
  { src: `${P}/fashion/ref29-parra2.webp`, title: 'Refinery29 Parramatta', category: 'fashion' },
  { src: `${P}/fashion/ref29-parra3.webp`, title: 'Refinery29 Parramatta', category: 'fashion' },
  { src: `${P}/fashion/ref29-mtdruitt3.webp`, title: 'Refinery29 Mt Druitt', category: 'fashion' },
  { src: `${P}/fashion/ref29-parra4.webp`, title: 'Refinery29 Parramatta', category: 'fashion' },
  { src: `${P}/fashion/oats-b3.webp`, title: 'Oats the Label', category: 'fashion' },
  { src: `${P}/fashion/oats2.webp`, title: 'Oats the Label', category: 'fashion' },
  { src: `${P}/fashion/flux2.webp`, title: 'Flux Handbag Brand', category: 'fashion' },
  {
    src: `${P}/fashion/akshaya-honours.webp`,
    title: 'Akshaya Bhutkar Honours Collection',
    category: 'fashion',
  },
  { src: `${P}/fashion/liaxs1.webp`, title: 'Lia x S', category: 'fashion' },
  { src: `${P}/fashion/tiara-vella.webp`, title: 'Tiara Vella', category: 'fashion' },
  { src: `${P}/fashion/aafw1.webp`, title: 'AAFW Erik Yvon Show', category: 'fashion' },
  { src: `${P}/fashion/culture-machine.webp`, title: 'Culture Machine', category: 'fashion' },
  {
    src: `${P}/fashion/akshaya-westfields.webp`,
    title: 'Akshaya x Westfields',
    category: 'fashion',
  },
  { src: `${P}/fashion/snakes-shanti2.webp`, title: 'Snakes and Shanti', category: 'fashion' },
  { src: `${P}/fashion/aafw2.webp`, title: 'AAFW Erik Yvon Show', category: 'fashion' },
  { src: `${P}/fashion/ref29-parra5.webp`, title: 'Refinery29 Parramatta', category: 'fashion' },

  // ═══ PORTRAITS ADDITIONAL ═══
  {
    src: `${P}/portraits/brown-suga2.webp`,
    title: 'Brown Suga Princess Press',
    category: 'portraits',
  },
  { src: `${P}/portraits/mia-dennis1.webp`, title: 'Mia Dennis', category: 'portraits' },
  {
    src: `${P}/portraits/brown-suga1.webp`,
    title: 'Brown Suga Princess Press',
    category: 'portraits',
  },
  { src: `${P}/portraits/min-wong.webp`, title: 'Min Wong', category: 'portraits' },
  { src: `${P}/portraits/kuta-beach.webp`, title: 'Kuta Beach', category: 'portraits' },
  { src: `${P}/portraits/mia-dennis2.webp`, title: 'Mia Dennis', category: 'portraits' },
  { src: `${P}/portraits/celina.webp`, title: 'Celina', category: 'portraits' },
  {
    src: `${P}/portraits/sara-gch.webp`,
    title: 'Sara for GCH Plant Dye Scarves',
    category: 'portraits',
  },
  { src: `${P}/portraits/cherry-chola.webp`, title: 'Cherry Chola', category: 'portraits' },
  { src: `${P}/portraits/yasmine.webp`, title: 'Yasmine for Pushmag', category: 'portraits' },
  {
    src: `${P}/portraits/brown-suga3.webp`,
    title: 'Brown Suga Princess Press',
    category: 'portraits',
  },
  { src: `${P}/portraits/thandi.webp`, title: 'Thandi', category: 'portraits' },
  { src: `${P}/portraits/ruger.webp`, title: 'Ruger for Acclaim Magazine', category: 'portraits' },

  // ═══ EVENT ═══
  { src: `${P}/event/fragile-minds.webp`, title: 'Fragile Minds', category: 'event' },
  { src: `${P}/event/club14.webp`, title: 'Club Selects', category: 'event' },
  { src: `${P}/event/club12.webp`, title: 'Club Selects', category: 'event' },
  { src: `${P}/event/wedding87.webp`, title: 'Ricky Nicole Wedding', category: 'event' },
  { src: `${P}/event/club-chrome.webp`, title: 'Club Chrome', category: 'event' },
  { src: `${P}/event/club8.webp`, title: 'Club Selects', category: 'event' },
  { src: `${P}/event/club9.webp`, title: 'Club Selects', category: 'event' },
  { src: `${P}/event/diwali11.webp`, title: 'Diwali at Powerhouse', category: 'event' },
  { src: `${P}/event/diwali63.webp`, title: 'Diwali at Powerhouse', category: 'event' },
  { src: `${P}/event/diwali83.webp`, title: 'Diwali at Powerhouse', category: 'event' },
  { src: `${P}/event/diwali-ph2.webp`, title: 'Diwali at Powerhouse Museum', category: 'event' },
  { src: `${P}/event/diwali-ph3.webp`, title: 'Diwali at Powerhouse Museum', category: 'event' },
  { src: `${P}/event/office-aafw.webp`, title: 'Office Magazine AAFW', category: 'event' },
  { src: `${P}/event/office-aafw-great.webp`, title: 'Office Magazine AAFW', category: 'event' },
  { src: `${P}/event/office-aafw3.webp`, title: 'Office Magazine AAFW', category: 'event' },
  { src: `${P}/event/office-aafw5.webp`, title: 'Office Magazine AAFW', category: 'event' },
  { src: `${P}/event/office-aafw6.webp`, title: 'Office Magazine AAFW', category: 'event' },
  { src: `${P}/event/club5.webp`, title: 'Club Selects', category: 'event' },
  { src: `${P}/event/club6.webp`, title: 'Club Selects', category: 'event' },
  { src: `${P}/event/club13.webp`, title: 'Club Selects', category: 'event' },
  { src: `${P}/event/club15.webp`, title: 'Club Selects', category: 'event' },
  { src: `${P}/event/club11.webp`, title: 'Club Selects', category: 'event' },
  { src: `${P}/event/genesis-owusu.webp`, title: 'Genesis Owusu', category: 'event' },
  { src: `${P}/event/planet-abundance.webp`, title: 'Planet Abundance', category: 'event' },
  { src: `${P}/event/diwali-ph4.webp`, title: 'Diwali at Powerhouse Museum', category: 'event' },

  // ═══ LIFE ADDITIONAL ═══
  { src: `${P}/life/paris-2025-3.webp`, title: 'Paris, 2025', category: 'life' },
  { src: `${P}/life/paris-2025-4.webp`, title: 'Paris, 2025', category: 'life' },
  { src: `${P}/life/punjab-1.webp`, title: 'Punjab, 2024', category: 'life' },
  { src: `${P}/life/punjab-2.webp`, title: 'Punjab, 2024', category: 'life' },
  { src: `${P}/life/punjab-3.webp`, title: 'Punjab, 2024', category: 'life' },
  { src: `${P}/life/punjab-4.webp`, title: 'Punjab, 2024', category: 'life' },
  { src: `${P}/life/punjab-5.webp`, title: 'Punjab, 2024', category: 'life' },
  { src: `${P}/life/punjab-6.webp`, title: 'Punjab, 2024', category: 'life' },
  { src: `${P}/life/3rd-eye1.webp`, title: 'Colombia, Sri Lanka, Bali, 2024', category: 'life' },
  { src: `${P}/life/3rd-eye3.webp`, title: 'Colombia, Sri Lanka, Bali, 2024', category: 'life' },
  { src: `${P}/life/3rd-eye5.webp`, title: 'Colombia, Sri Lanka, Bali, 2024', category: 'life' },
  { src: `${P}/life/3rd-eye7.webp`, title: 'Colombia, Sri Lanka, Bali, 2024', category: 'life' },
  { src: `${P}/life/3rd-eye9.webp`, title: 'Colombia, Sri Lanka, Bali, 2024', category: 'life' },
  { src: `${P}/life/3rd-eye11.webp`, title: 'Colombia, Sri Lanka, Bali, 2024', category: 'life' },
  { src: `${P}/life/3rd-eye14.webp`, title: 'Colombia, Sri Lanka, Bali, 2024', category: 'life' },
  { src: `${P}/life/3rd-eye17.webp`, title: 'Colombia, Sri Lanka, Bali, 2024', category: 'life' },
  { src: `${P}/life/india-2019-1.webp`, title: 'India, 2019', category: 'life' },
  { src: `${P}/life/india-2019-3.webp`, title: 'India, 2019', category: 'life' },
  { src: `${P}/life/india-2019-4.webp`, title: 'India, 2019', category: 'life' },
  { src: `${P}/life/india-2019-5.webp`, title: 'India, 2019', category: 'life' },
]

const filterTabs = [
  { key: 'all', label: 'All' },
  { key: 'fashion', label: 'Fashion' },
  { key: 'portraits', label: 'Portraits' },
  { key: 'event', label: 'Event' },
  { key: 'life', label: 'Life' },
]

export function PhotographyGrid() {
  const [filter, setFilter] = useState('all')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const filtered =
    filter === 'all' ? photos.filter((p) => p.curated) : photos.filter((p) => p.category === filter)

  return (
    <>
      {/* Filter bar */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
        {filterTabs.map((f, i) => (
          <span key={f.key} className="flex items-center gap-3">
            <button
              onClick={() => setFilter(f.key)}
              className={`uppercase tracking-[0.15em] transition-colors ${
                filter === f.key
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              }`}
              style={{ fontSize: 'var(--text-sm)' }}
            >
              {f.label}
            </button>
            {i < filterTabs.length - 1 && (
              <span className="text-[var(--text-muted)] opacity-30">/</span>
            )}
          </span>
        ))}
      </div>

      {/* Photo grid — uniform vertical ratio */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((photo, i) => (
            <motion.div
              key={photo.src}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.3) }}
              className="cursor-pointer overflow-hidden"
              onClick={() => setLightbox(i)}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading={i < 10 ? 'eager' : 'lazy'}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-4xl text-white/70 hover:text-white"
            onClick={(e) => {
              e.stopPropagation()
              setLightbox((lightbox - 1 + filtered.length) % filtered.length)
            }}
          >
            &#8249;
          </button>

          <div
            className="flex max-h-[90vh] max-w-[90vw] flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={filtered[lightbox].src}
              alt={filtered[lightbox].title}
              className="max-h-[82vh] max-w-[88vw] object-contain"
            />
            <p className="mt-3 text-center text-sm tracking-wide text-white/70">
              {filtered[lightbox].title}
            </p>
          </div>

          <button
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-4xl text-white/70 hover:text-white"
            onClick={(e) => {
              e.stopPropagation()
              setLightbox((lightbox + 1) % filtered.length)
            }}
          >
            &#8250;
          </button>
          <button
            className="absolute right-6 top-6 text-2xl text-white/70 hover:text-white"
            onClick={() => setLightbox(null)}
          >
            &times;
          </button>
        </div>
      )}
    </>
  )
}
