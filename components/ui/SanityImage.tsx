'use client'

import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import type { SanityImageSource } from '@sanity/image-url'

interface SanityImageProps {
  image: SanityImageSource
  alt: string
  width: number
  height: number
  sizes?: string
  className?: string
  priority?: boolean
}

export function SanityImage({
  image,
  alt,
  width,
  height,
  sizes,
  className,
  priority,
}: SanityImageProps) {
  const src = urlFor(image).width(width).url()

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
    />
  )
}
