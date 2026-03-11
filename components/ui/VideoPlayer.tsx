'use client'

interface VideoPlayerProps {
  platform: 'vimeo' | 'youtube'
  videoId: string
  aspect?: string
  className?: string
}

function getEmbedUrl(platform: string, id: string): string {
  if (platform === 'vimeo') {
    return `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`
  }
  return `https://www.youtube.com/embed/${id}?rel=0`
}

export function VideoPlayer({ platform, videoId, aspect = '16 / 9', className }: VideoPlayerProps) {
  const src = getEmbedUrl(platform, videoId)

  return (
    <div className={className} style={{ aspectRatio: aspect, position: 'relative' }}>
      <iframe
        src={src}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}
