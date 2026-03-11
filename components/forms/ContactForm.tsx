'use client'

import { useForm, ValidationError } from '@formspree/react'

export function ContactForm() {
  const [state, handleSubmit] = useForm('xpqypgaw')

  if (state.succeeded) {
    return (
      <div className="rounded-lg border border-[var(--border)] p-8 text-center">
        <p className="text-[var(--text-lg)] font-medium text-[var(--text-primary)]">
          Thanks for reaching out!
        </p>
        <p className="mt-2 text-[var(--text-sm)] text-[var(--text-secondary)]">
          I&apos;ll get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot */}
      <input
        type="text"
        name="_gotcha"
        style={{ display: 'none' }}
        tabIndex={-1}
        autoComplete="off"
      />

      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-[var(--text-sm)] text-[var(--text-secondary)]"
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          required
          className="w-full rounded border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)]"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-[var(--text-sm)] text-[var(--text-secondary)]"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          className="w-full rounded border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)]"
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-[var(--text-sm)] text-[var(--text-secondary)]"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--accent)]"
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} />
      </div>

      <button
        type="submit"
        disabled={state.submitting}
        className="w-full rounded bg-[var(--accent)] px-6 py-2.5 font-medium text-[var(--bg-primary)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-50"
      >
        {state.submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
