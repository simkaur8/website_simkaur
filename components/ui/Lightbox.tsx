'use client'

import YARLightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'

interface LightboxImage {
  src: string
  alt: string
}

interface LightboxProps {
  images: LightboxImage[]
  open: boolean
  onClose: () => void
  initialIndex?: number
}

export function Lightbox({ images, open, onClose, initialIndex = 0 }: LightboxProps) {
  return (
    <YARLightbox
      open={open}
      close={onClose}
      index={initialIndex}
      slides={images.map((img) => ({ src: img.src, alt: img.alt }))}
      plugins={[Zoom]}
      styles={{
        container: { backgroundColor: 'rgba(0, 0, 0, 0.92)' },
      }}
    />
  )
}
