import { client } from '@/sanity/lib/client'
import { linkInBioQuery } from '@/sanity/lib/queries'
import type { LinkInBio } from '@/sanity/lib/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Links',
  description: 'Links and social media for Sim Kaur.',
  alternates: { canonical: '/links' },
  robots: { index: false },
}

export const revalidate = 60

const fallbackLinks = [
  { label: 'Website', url: 'https://simkaur.art' },
  { label: 'Instagram', url: 'https://www.instagram.com/s1mkaur/' },
  { label: 'Vimeo', url: 'https://vimeo.com/user197917349' },
  { label: 'Email', url: 'mailto:simtheaquarius@gmail.com' },
]

export default async function LinksPage() {
  const data: LinkInBio | null = await client.fetch(linkInBioQuery)
  const links = data?.links || fallbackLinks

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div>
          <h1 className="text-[var(--text-xl)] font-semibold tracking-[0.1em]">SIM KAUR</h1>
          <p className="mt-1 text-[var(--text-sm)] text-[var(--text-muted)]">Creative Director</p>
        </div>

        <div className="space-y-3">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg border border-[var(--border)] px-6 py-3 text-center text-[var(--text-base)] text-[var(--text-primary)] transition-all hover:border-[var(--accent)] hover:bg-[var(--bg-surface)]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
