import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Lightbox } from '@/components/ui/Lightbox'

// Mock yet-another-react-lightbox and its plugins
vi.mock('yet-another-react-lightbox', () => ({
  default: ({
    open,
    close,
    index,
    slides,
  }: {
    open: boolean
    close: () => void
    index: number
    slides: { src: string; alt: string }[]
  }) => {
    if (!open) return null
    const currentSlide = slides[index]
    return (
      <div data-testid="lightbox-container" role="dialog">
        <img src={currentSlide.src} alt={currentSlide.alt} />
        <button aria-label="Close" onClick={close}>
          Close
        </button>
      </div>
    )
  },
}))

vi.mock('yet-another-react-lightbox/plugins/zoom', () => ({
  default: {},
}))

vi.mock('yet-another-react-lightbox/styles.css', () => ({}))

const testImages = [
  { src: '/img1.jpg', alt: 'Image 1' },
  { src: '/img2.jpg', alt: 'Image 2' },
  { src: '/img3.jpg', alt: 'Image 3' },
]

describe('LightboxNavigation – integration', () => {
  it('shows an image when opened', () => {
    render(<Lightbox images={testImages} open={true} onClose={vi.fn()} initialIndex={0} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByAltText('Image 1')).toBeInTheDocument()
  })

  it('shows correct image based on initialIndex', () => {
    render(<Lightbox images={testImages} open={true} onClose={vi.fn()} initialIndex={2} />)
    expect(screen.getByAltText('Image 3')).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    render(<Lightbox images={testImages} open={false} onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<Lightbox images={testImages} open={true} onClose={onClose} initialIndex={0} />)
    screen.getByLabelText('Close').click()
    expect(onClose).toHaveBeenCalledOnce()
  })

  // Arrow key navigation is handled internally by yet-another-react-lightbox.
  // Since we mock the library, we cannot test its internal keyboard handlers.
  // In a real E2E test (Playwright), arrow key navigation should be verified.
})
