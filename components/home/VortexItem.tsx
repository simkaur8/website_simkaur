import Link from 'next/link'
import { cn } from '@/lib/utils'

interface VortexItemProps {
  id: string
  left: number
  top: number
  size: string
  ring: number
  href?: string
  title?: string
  tag?: string
  image: string
  under?: boolean
  imageStyle?: string
}

export function VortexItem({
  left,
  top,
  size,
  ring,
  href,
  title,
  tag,
  image,
  under,
  imageStyle,
}: VortexItemProps) {
  const ringClass = ring > 0 ? `vx-ring-${ring}` : ''

  // Parse imageStyle string into a style object
  const imgStyle: React.CSSProperties = {}
  if (imageStyle) {
    imageStyle.split(';').forEach((s) => {
      const [k, v] = s.split(':').map((x) => x.trim())
      if (k === 'object-position') imgStyle.objectPosition = v
    })
  }

  // For GIFs, generate a static fallback path
  const isGif = image.endsWith('.gif')
  const staticFallback = isGif ? image.replace('.gif', '-static.webp') : undefined

  const content = (
    <>
      <img
        src={image}
        alt={title || ''}
        loading={ring <= 1 ? 'eager' : 'lazy'}
        decoding="async"
        style={imgStyle}
        {...(staticFallback
          ? {
              onError: (e) => {
                const img = e.currentTarget
                if (!img.dataset.fallback) {
                  img.dataset.fallback = '1'
                  img.src = staticFallback
                }
              },
            }
          : {})}
      />
      {title && (
        <div className="g-overlay">
          <span className="g-title">{title}</span>
          {tag && <span className="g-tag">{tag}</span>}
        </div>
      )}
    </>
  )

  const className = cn('vx-item', size, ringClass, under && 'vx-under')

  if (href) {
    return (
      <Link href={href} className={className} style={{ left: `${left}%`, top: `${top}%` }}>
        {content}
      </Link>
    )
  }

  return (
    <div className={className} style={{ left: `${left}%`, top: `${top}%` }}>
      {content}
    </div>
  )
}
