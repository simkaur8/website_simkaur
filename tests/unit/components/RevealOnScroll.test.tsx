import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'

describe('RevealOnScroll', () => {
  it('renders children', () => {
    render(
      <RevealOnScroll>
        <p>Hello world</p>
      </RevealOnScroll>
    )
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })
})
