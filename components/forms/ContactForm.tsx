'use client'

import { useForm, ValidationError } from '@formspree/react'

export function ContactForm() {
  const [state, handleSubmit] = useForm('xpqypgaw')

  if (state.succeeded) {
    return (
      <div
        className="relative p-8 text-center"
        style={{
          border: '3px solid #ff69b4',
          boxShadow: '6px 6px 0 #00e5ff, -2px -2px 0 #ffe600',
          background: 'linear-gradient(135deg, #1a002e 0%, #0d0028 100%)',
          imageRendering: 'pixelated',
        }}
      >
        <p
          className="font-bold uppercase tracking-widest"
          style={{ fontSize: 'var(--text-lg)', color: '#00e5ff' }}
        >
          Message sent !!
        </p>
        <p className="mt-2" style={{ fontSize: 'var(--text-sm)', color: '#ff69b4' }}>
          ty 4 reaching out ~ i&apos;ll get back 2 u soon :-)
        </p>
        <div className="pointer-events-none absolute -right-2 -top-2 text-2xl" aria-hidden="true">
          &#10022;
        </div>
      </div>
    )
  }

  const inputClass =
    'w-full px-4 py-3 font-mono text-sm outline-none transition-colors placeholder:opacity-40'

  return (
    <form
      onSubmit={handleSubmit}
      className="relative space-y-5"
      style={{
        border: '3px solid #ff69b4',
        padding: 'clamp(1.2rem, 3vw, 2rem)',
        boxShadow: '8px 8px 0 #00e5ff',
        background: 'linear-gradient(180deg, #1a002e 0%, #0d0028 100%)',
      }}
    >
      {/* Decorative corner stars */}
      <span
        className="pointer-events-none absolute -left-3 -top-3 text-lg"
        style={{ color: '#ffe600' }}
        aria-hidden="true"
      >
        &#10022;
      </span>
      <span
        className="pointer-events-none absolute -bottom-3 -right-3 text-lg"
        style={{ color: '#ffe600' }}
        aria-hidden="true"
      >
        &#10022;
      </span>

      {/* Title */}
      <p
        className="text-center font-bold uppercase tracking-[0.2em]"
        style={{ fontSize: 'var(--text-base)', color: '#00e5ff' }}
      >
        ~ drop a msg ~
      </p>

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
          className="mb-1.5 block font-mono text-xs uppercase tracking-[0.15em]"
          style={{ color: '#ff69b4' }}
        >
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          required
          placeholder="ur name"
          className={inputClass}
          style={{
            border: '2px solid #ff69b4',
            background: '#0a0018',
            color: '#ffffff',
            boxShadow: '3px 3px 0 #3d0066',
          }}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block font-mono text-xs uppercase tracking-[0.15em]"
          style={{ color: '#ff69b4' }}
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          required
          placeholder="email@domain.com"
          className={inputClass}
          style={{
            border: '2px solid #ff69b4',
            background: '#0a0018',
            color: '#ffffff',
            boxShadow: '3px 3px 0 #3d0066',
          }}
        />
        <ValidationError prefix="Email" field="email" errors={state.errors} />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block font-mono text-xs uppercase tracking-[0.15em]"
          style={{ color: '#ff69b4' }}
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="what's on ur mind..."
          className={inputClass}
          style={{
            border: '2px solid #ff69b4',
            background: '#0a0018',
            color: '#ffffff',
            boxShadow: '3px 3px 0 #3d0066',
            resize: 'vertical',
          }}
        />
        <ValidationError prefix="Message" field="message" errors={state.errors} />
      </div>

      <button
        type="submit"
        disabled={state.submitting}
        className="w-full cursor-pointer py-3 font-bold uppercase tracking-[0.15em] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] disabled:opacity-50"
        style={{
          fontSize: 'var(--text-base)',
          border: '2px solid #00e5ff',
          background: 'linear-gradient(90deg, #ff69b4, #ff1493)',
          color: '#ffffff',
          boxShadow: '4px 4px 0 #00e5ff',
          letterSpacing: '0.15em',
        }}
      >
        {state.submitting ? '>> sending... <<' : '>> send it <<'}
      </button>

      {/* Bottom decorative text */}
      <p
        className="text-center font-mono text-xs tracking-wider"
        style={{ color: 'rgba(255, 105, 180, 0.4)' }}
      >
        &#9733; built w/ luv &#9733;
      </p>
    </form>
  )
}
