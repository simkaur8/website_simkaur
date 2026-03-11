import { describe, it, expect } from 'vitest'
import { getVideoEmbedUrl } from '@/lib/utils'

describe('getVideoEmbedUrl', () => {
  it('returns Vimeo player URL', () => {
    expect(getVideoEmbedUrl('vimeo', '1092672509')).toBe(
      'https://player.vimeo.com/video/1092672509'
    )
  })
  it('returns YouTube watch URL', () => {
    expect(getVideoEmbedUrl('youtube', 'dGxXAoKr_X4')).toBe(
      'https://www.youtube.com/watch?v=dGxXAoKr_X4'
    )
  })
  it('throws for unknown platform', () => {
    expect(() => getVideoEmbedUrl('tiktok', '123')).toThrow('Unsupported video platform: tiktok')
  })
})
