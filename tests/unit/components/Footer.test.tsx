import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '@/components/Footer'

describe('Footer', () => {
  const defaultProps = {
    email: 'simtheaquarius@gmail.com',
    footerCta: 'contact me :-)',
    socialLinks: [
      { platform: 'Instagram', url: 'https://www.instagram.com/s1mkaur/' },
      { platform: 'Vimeo', url: 'https://vimeo.com/user197917349' },
    ],
  }

  it('renders the CTA text', () => {
    render(<Footer {...defaultProps} />)
    expect(screen.getByText('contact me :-)')).toBeInTheDocument()
  })

  it('renders email link', () => {
    render(<Footer {...defaultProps} />)
    const emailLink = screen.getByText('simtheaquarius@gmail.com')
    expect(emailLink).toHaveAttribute('href', 'mailto:simtheaquarius@gmail.com')
  })

  it('renders social links with target blank', () => {
    render(<Footer {...defaultProps} />)
    const insta = screen.getByText('Instagram')
    expect(insta).toHaveAttribute('href', 'https://www.instagram.com/s1mkaur/')
    expect(insta).toHaveAttribute('target', '_blank')
    expect(insta).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('renders semantic footer element', () => {
    const { container } = render(<Footer {...defaultProps} />)
    expect(container.querySelector('footer')).toBeInTheDocument()
  })
})
