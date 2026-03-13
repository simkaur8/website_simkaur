'use client'

interface VideoPlayerProps {
  platform: 'vimeo' | 'youtube'
  videoId: string
  hash?: string
  aspect?: string
  className?: string
}

function getEmbedUrl(platform: string, id: string, hash?: string): string {
  if (platform === 'vimeo') {
    const h = hash ? `&h=${hash}` : ''
    return `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0${h}`
  }
  return `https://www.youtube.com/embed/${id}?rel=0`
}

export function VideoPlayer({
  platform,
  videoId,
  hash,
  aspect = '16 / 9',
  className,
}: VideoPlayerProps) {
  const src = getEmbedUrl(platform, videoId, hash)

  return (
    <div className={className} style={{ aspectRatio: aspect, position: 'relative' }}>
      <iframe
        src={src}
        title={`${platform === 'vimeo' ? 'Vimeo' : 'YouTube'} video player`}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}
