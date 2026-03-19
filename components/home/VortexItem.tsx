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
  zIndex?: number
  mobilePriority?: boolean
  aspectOverride?: string
  scale?: number
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
  zIndex,
  mobilePriority,
  aspectOverride,
  scale,
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
        alt={title || 'Portfolio image'}
        loading={ring <= 1 ? 'eager' : 'lazy'}
        decoding={ring <= 1 ? 'sync' : 'async'}
        fetchPriority={ring === 0 ? 'high' : undefined}
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

  const className = cn(
    'vx-item',
    size,
    ringClass,
    under && 'vx-under',
    mobilePriority && 'vx-mobile-priority'
  )

  const itemStyle: React.CSSProperties = {
    left: `${left}%`,
    top: `${top}%`,
    ...(zIndex != null && { zIndex }),
    ...(aspectOverride && { aspectRatio: aspectOverride }),
    ...(scale != null && scale !== 1 && { ['--vx-scale' as string]: scale }),
  }

  if (href) {
    return (
      <Link href={href} className={className} style={itemStyle}>
        {content}
      </Link>
    )
  }

  return (
    <div className={className} style={itemStyle}>
      {content}
    </div>
  )
}
