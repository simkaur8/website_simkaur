import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ContactForm } from '@/components/forms/ContactForm'

// Track the mock state so we can mutate it mid-test
let mockState = { succeeded: false, submitting: false, errors: [] }
const mockHandleSubmit = vi.fn((e: React.FormEvent) => {
  e.preventDefault()
  mockState = { succeeded: true, submitting: false, errors: [] }
})

vi.mock('@formspree/react', () => ({
  useForm: () => [mockState, mockHandleSubmit],
  ValidationError: () => null,
}))

describe('ContactFormSubmission – integration', () => {
  beforeEach(() => {
    mockState = { succeeded: false, submitting: false, errors: [] }
    mockHandleSubmit.mockClear()
  })

  it('renders name, email, and message fields', () => {
    render(<ContactForm />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
  })

  it('fills in all fields and submits, showing success message', () => {
    const { rerender } = render(<ContactForm />)

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/message/i), { target: { value: 'Hello there' } })

    fireEvent.click(screen.getByRole('button', { name: /send/i }))
    expect(mockHandleSubmit).toHaveBeenCalledOnce()

    // After submission, mockState.succeeded is true — re-render to reflect new state
    rerender(<ContactForm />)
    expect(screen.getByText(/thanks for reaching out/i)).toBeInTheDocument()
    expect(screen.getByText(/get back to you soon/i)).toBeInTheDocument()
  })
})
