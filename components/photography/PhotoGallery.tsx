'use client'

import { useState } from 'react'
import { Lightbox } from '@/components/ui/Lightbox'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import type { PhotoCollection } from '@/sanity/lib/types'

interface PhotoGalleryProps {
  collection: PhotoCollection
}

export function PhotoGallery({ collection }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const images =
    collection.photos?.map((photo) => ({
      src: '/placeholder.svg',
      alt: photo.image?.alt || photo.caption || '',
    })) || []

  return (
    <div>
      <RevealOnScroll>
        <div className="columns-2 gap-3 md:columns-3 lg:columns-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setLightboxIndex(i)
                setLightboxOpen(true)
              }}
              className="mb-3 block w-full overflow-hidden bg-[var(--bg-surface)]"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      </RevealOnScroll>

      {images.length === 0 && (
        <p className="py-24 text-center text-[var(--text-muted)]">
          No photos in this collection yet.
        </p>
      )}

      <Lightbox
        images={images}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        initialIndex={lightboxIndex}
      />
    </div>
  )
}
