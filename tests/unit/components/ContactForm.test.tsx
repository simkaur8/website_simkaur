import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContactForm } from '@/components/forms/ContactForm'

// Mock @formspree/react
vi.mock('@formspree/react', () => ({
  useForm: () => [{ succeeded: false, submitting: false, errors: [] }, vi.fn()],
  ValidationError: () => null,
}))

describe('ContactForm', () => {
  it('renders name, email, and message fields', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<ContactForm />)
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('has honeypot field for spam protection', () => {
    const { container } = render(<ContactForm />)
    const honeypot = container.querySelector('input[name="_gotcha"]')
    expect(honeypot).toBeInTheDocument()
  })
})
