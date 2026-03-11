import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Not Found | Sim Kaur',
  description: 'The page you are looking for does not exist.',
  robots: { index: false },
}

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-4 font-semibold tracking-[0.1em]" style={{ fontSize: 'var(--text-4xl)' }}>
        404
      </h1>
      <p className="mb-8 text-[var(--text-base)] text-[var(--text-secondary)]">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="rounded-lg border border-[var(--border)] px-6 py-2.5 text-[var(--text-sm)] text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--bg-surface)]"
      >
        Back to Home
      </Link>
    </div>
  )
}
