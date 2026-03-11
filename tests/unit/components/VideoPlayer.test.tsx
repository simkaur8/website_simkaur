import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { VideoPlayer } from '@/components/ui/VideoPlayer'

vi.mock('react-player', () => ({
  default: (props: Record<string, unknown>) => (
    <div data-testid="react-player" data-src={props.src as string} />
  ),
}))

describe('VideoPlayer', () => {
  it('renders Vimeo embed with correct URL', () => {
    const { getByTestId } = render(<VideoPlayer platform="vimeo" videoId="1092672509" />)
    expect(getByTestId('react-player')).toHaveAttribute(
      'data-src',
      'https://player.vimeo.com/video/1092672509'
    )
  })

  it('renders YouTube embed with correct URL', () => {
    const { getByTestId } = render(<VideoPlayer platform="youtube" videoId="dGxXAoKr_X4" />)
    expect(getByTestId('react-player')).toHaveAttribute(
      'data-src',
      'https://www.youtube.com/watch?v=dGxXAoKr_X4'
    )
  })
})
