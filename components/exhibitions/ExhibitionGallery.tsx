'use client'

import { useState } from 'react'
import { Lightbox } from '@/components/ui/Lightbox'

interface MediaItem {
  src: string
  alt: string
  portrait: boolean
}

interface ExhibitionGalleryProps {
  media: MediaItem[]
  scrollGallery?: boolean
}

export function ExhibitionGallery({ media, scrollGallery }: ExhibitionGalleryProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const openAt = (i: number) => {
    setIndex(i)
    setOpen(true)
  }

  if (scrollGallery) {
    return (
      <>
        <div
          className="mb-8 flex overflow-x-auto"
          style={{
            gap: 'clamp(0.5rem, 1vw, 0.8rem)',
            height: 'clamp(150px, calc(min(100vw - 4rem, 72rem) / 3 * 0.8), 310px)',
          }}
        >
          {media.map((item, i) => (
            <div
              key={i}
              className="h-full flex-shrink-0 cursor-pointer overflow-hidden"
              style={{ aspectRatio: item.portrait ? '2/3' : '5/4' }}
              onClick={() => openAt(i)}
            >
              <img
                src={item.src}
                alt={item.alt || ''}
                className="h-full w-full object-cover transition-opacity hover:opacity-85"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <Lightbox
          images={media.map(({ src, alt }) => ({ src, alt }))}
          open={open}
          onClose={() => setOpen(false)}
          initialIndex={index}
        />
      </>
    )
  }

  return (
    <>
      <div
        className="mb-8 grid grid-cols-1 sm:grid-cols-3"
        style={{ gap: 'clamp(0.5rem, 1vw, 0.8rem)' }}
      >
        {media.map((item, i) => (
          <div
            key={i}
            className="aspect-[5/4] cursor-pointer overflow-hidden"
            onClick={() => openAt(i)}
          >
            <img
              src={item.src}
              alt={item.alt || ''}
              className="h-full w-full object-cover transition-opacity hover:opacity-85"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      <Lightbox
        images={media.map(({ src, alt }) => ({ src, alt }))}
        open={open}
        onClose={() => setOpen(false)}
        initialIndex={index}
      />
    </>
  )
}
