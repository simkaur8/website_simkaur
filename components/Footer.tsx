interface FooterProps {
  email: string
  footerCta?: string
  socialLinks?: { platform: string; url: string }[]
}

export function Footer({ email, footerCta, socialLinks }: FooterProps) {
  const year = new Date().getFullYear()

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
      <p className="mt-1 text-[var(--text-muted)] sm:mt-2" style={{ fontSize: '0.6rem' }}>
        Sim Kaur &copy; {year} Creative Direction
      </p>
    </footer>
  )
}
