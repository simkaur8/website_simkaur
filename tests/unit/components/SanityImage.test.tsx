import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SanityImage } from '@/components/ui/SanityImage'

// Mock next/image
vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: Record<string, unknown>) => <img {...props} />,
}))

// Mock the image URL builder
vi.mock('@/sanity/lib/image', () => ({
  urlFor: (_source: Record<string, unknown>) => ({
    width: (w: number) => ({
      height: (h: number) => ({
        url: () => `https://cdn.sanity.io/images/test/${w}x${h}.jpg`,
      }),
      url: () => `https://cdn.sanity.io/images/test/${w}.jpg`,
    }),
    url: () => 'https://cdn.sanity.io/images/test/default.jpg',
  }),
}))

describe('SanityImage', () => {
  const mockImage = {
    _type: 'image' as const,
    asset: { _ref: 'image-123', _type: 'reference' as const },
  }

  it('renders an image with alt text', () => {
    render(<SanityImage image={mockImage} alt="Test image" width={800} height={600} />)
    expect(screen.getByAltText('Test image')).toBeInTheDocument()
  })

  it('requires alt text prop', () => {
    render(<SanityImage image={mockImage} alt="Required alt" width={800} height={600} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('alt', 'Required alt')
  })
})
