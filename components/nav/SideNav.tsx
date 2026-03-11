'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LogoVideo } from './LogoVideo'

const navLinks = [
  { href: '/direction', label: 'Direction' },
  { href: '/photography', label: 'Photography' },
  { href: '/exhibitions', label: 'Exhibitions' },
  { href: '/about', label: 'About' },
]

export function SideNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed left-0 top-0 z-40 hidden h-full w-20 flex-col items-center justify-between border-r border-[var(--border)] bg-[var(--bg-primary)] py-8 lg:flex">
      <Link href="/" aria-label="Home">
        <LogoVideo className="h-12 w-12" />
      </Link>

      <ul className="flex flex-col gap-6">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                'text-[var(--text-xs)] font-medium uppercase tracking-widest transition-colors duration-[var(--duration-fast)]',
                'writing-mode-vertical-lr rotate-180',
                pathname.startsWith(link.href)
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div />
    </nav>
  )
}
