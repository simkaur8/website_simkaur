'use client'

import { Fragment, useSyncExternalStore } from 'react'
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

function getScrollPastHero() {
  if (typeof window === 'undefined') return false
  return window.scrollY > window.innerHeight * 0.8
}

function subscribeScroll(callback: () => void) {
  window.addEventListener('scroll', callback, { passive: true })
  return () => window.removeEventListener('scroll', callback)
}

export function SideNav() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const scrolledPastHero = useSyncExternalStore(subscribeScroll, getScrollPastHero, () => false)

  const visible = isHome ? scrolledPastHero : true

  return (
    <nav
      className={cn(
        'fixed left-0 top-0 z-40 hidden h-full w-[220px] flex-col py-8 pl-8 transition-all duration-500 lg:flex',
        visible
          ? 'opacity-100 translate-x-0 pointer-events-auto'
          : 'opacity-0 -translate-x-5 pointer-events-none'
      )}
    >
      <Link href="/" aria-label="Home" className="mb-10">
        <LogoVideo webmSrc="/videos/logo.webm" movSrc="/videos/logo.mov" className="w-[130px]" />
      </Link>

      <ul className="flex flex-col gap-4">
        {navLinks.map((link, index) => (
          <Fragment key={link.href}>
            {index === 2 && <li className="h-3.5" aria-hidden="true" />}
            <li>
              <Link
                href={link.href}
                className={cn(
                  'text-[var(--text-lg)] font-normal tracking-wide transition-colors duration-[var(--duration-fast)]',
                  pathname.startsWith(link.href)
                    ? 'text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                )}
              >
                {link.label}
              </Link>
            </li>
          </Fragment>
        ))}
      </ul>
    </nav>
  )
}
