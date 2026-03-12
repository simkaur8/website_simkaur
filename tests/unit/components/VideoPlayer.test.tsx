import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { VideoPlayer } from '@/components/ui/VideoPlayer'

describe('VideoPlayer', () => {
  it('renders Vimeo embed with correct URL', () => {
    const { container } = render(<VideoPlayer platform="vimeo" videoId="1092672509" />)
    const iframe = container.querySelector('iframe')
    expect(iframe).toBeTruthy()
    expect(iframe?.getAttribute('src')).toBe(
      'https://player.vimeo.com/video/1092672509?title=0&byline=0&portrait=0'
    )
  })

  it('renders YouTube embed with correct URL', () => {
    const { container } = render(<VideoPlayer platform="youtube" videoId="dGxXAoKr_X4" />)
    const iframe = container.querySelector('iframe')
    expect(iframe).toBeTruthy()
    expect(iframe?.getAttribute('src')).toBe('https://www.youtube.com/embed/dGxXAoKr_X4?rel=0')
  })
})
