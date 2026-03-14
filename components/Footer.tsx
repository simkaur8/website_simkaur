interface FooterProps {
  email: string
  footerCta?: string
  socialLinks?: { platform: string; url: string }[]
}

export function Footer({ email, footerCta, socialLinks }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="flex flex-col items-center gap-4 py-24 text-center">
      {footerCta && (
        <p className="text-[var(--text-lg)] font-medium text-[var(--text-primary)]">{footerCta}</p>
      )}
      <div className="flex flex-col items-center gap-3 text-[var(--text-sm)] text-[var(--text-secondary)] sm:flex-row sm:gap-2">
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
      <p className="mt-2 text-[var(--text-xs)] text-[var(--text-muted)]">
        Sim Kaur &copy; {year} Creative Director
      </p>
    </footer>
  )
}
