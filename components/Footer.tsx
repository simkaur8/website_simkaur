'use client'

import { useSyncExternalStore } from 'react'

interface FooterProps {
  email: string
  footerCta?: string
  socialLinks?: { platform: string; url: string }[]
}

const yearSubscribe = () => () => {}

export function Footer({ email, footerCta, socialLinks }: FooterProps) {
  const year = useSyncExternalStore(
    yearSubscribe,
    () => new Date().getFullYear(),
    () => 2026
  )

  return (
    <footer className="flex flex-col items-center gap-3 py-16 text-center sm:gap-4 sm:py-24">
      {footerCta && (
        <p className="text-[var(--text-base)] font-medium text-[var(--text-primary)] sm:text-[var(--text-lg)]">
          {footerCta}
        </p>
      )}
      <div className="flex flex-col items-center gap-2 text-[var(--text-xs)] text-[var(--text-secondary)] sm:flex-row sm:gap-2 sm:text-[var(--text-sm)]">
        <a href={`mailto:${email}`} className="transition-colors hover:text-[var(--accent)]">
          {email}
        </a>
        {socialLinks?.map((link) => (
          <span key={link.platform}>
            <span className="mx-2 hidden text-[var(--text-muted)] sm:inline">/</span>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--accent)]"
            >
              {link.platform}
            </a>
          </span>
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <span
          className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-0.5 text-green-400"
          style={{ fontSize: '0.65rem', letterSpacing: '0.08em' }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          Available for commission
        </span>
      </div>
      <p className="mt-2 text-[var(--text-muted)]" style={{ fontSize: '0.6rem' }}>
        Sim Kaur &copy; {year}
      </p>
    </footer>
  )
}
