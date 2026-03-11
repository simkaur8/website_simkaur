import { PortableText } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

interface AboutBioProps {
  bio?: PortableTextBlock[]
  email: string
  socialLinks?: { platform: string; url: string }[]
}

export function AboutBio({ bio, email, socialLinks }: AboutBioProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Portrait placeholder -- will be replaced with Sanity image */}
      <div className="mx-auto h-64 w-64 overflow-hidden rounded-full bg-[var(--bg-surface)]" />

      {bio && (
        <div className="text-center text-[var(--text-base)] leading-relaxed text-[var(--text-secondary)]">
          <PortableText value={bio} />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4 text-[var(--text-sm)]">
        <a
          href={`mailto:${email}`}
          className="text-[var(--accent)] hover:text-[var(--accent-hover)]"
        >
          {email}
        </a>
        {socialLinks?.map((link) => (
          <a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--text-secondary)] hover:text-[var(--accent)]"
          >
            {link.platform}
          </a>
        ))}
      </div>
    </div>
  )
}
