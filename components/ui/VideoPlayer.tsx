'use client'

import ReactPlayer from 'react-player'
import { getVideoEmbedUrl } from '@/lib/utils'

interface VideoPlayerProps {
  platform: 'vimeo' | 'youtube'
  videoId: string
  posterImage?: string
  className?: string
}

export function VideoPlayer({ platform, videoId, posterImage, className }: VideoPlayerProps) {
  const url = getVideoEmbedUrl(platform, videoId)

  return (
    <div className={className} style={{ aspectRatio: '16 / 9', position: 'relative' }}>
      <ReactPlayer
        src={url}
        width="100%"
        height="100%"
        light={posterImage}
        playing={!!posterImage}
        controls
      />
    </div>
  )
}
