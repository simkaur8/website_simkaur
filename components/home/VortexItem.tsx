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
}

export function VortexItem({ left, top, size, ring, href, title, tag, image }: VortexItemProps) {
  const ringClass = ring > 0 ? `vx-ring-${ring}` : ''

  const content = (
    <>
      <img src={image} alt={title || ''} loading="lazy" />
      {title && (
        <div className="g-overlay">
          <span className="g-title">{title}</span>
          {tag && <span className="g-tag">{tag}</span>}
        </div>
      )}
    </>
  )

  const className = cn('vx-item', size, ringClass)

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
