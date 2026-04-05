'use client'

import { Fragment, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LogoVideo } from './LogoVideo'

const navLinks = [
  { href: '/direction', label: 'Video' },
  { href: '/photography', label: 'Photo' },
  { href: '/exhibitions', label: 'Exhibitions' },
  { href: '/about', label: 'About' },
]

const videoSubLinks = [
  { href: '/direction', label: 'All', filter: null },
  { href: '/direction?filter=fashion-dance', label: 'Fashion & Dance', filter: 'fashion-dance' },
  { href: '/direction?filter=music-video', label: 'Music Videos', filter: 'music-video' },
]

function getScrollPastHero() {
  if (typeof window === 'undefined') return false
  return window.scrollY > window.innerHeight * 0.85
}

function subscribeScroll(callback: () => void) {
  window.addEventListener('scroll', callback, { passive: true })
  return () => window.removeEventListener('scroll', callback)
}

export function SideNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isHome = pathname === '/'
  const isVideoSection = pathname.startsWith('/direction')
  const activeFilter = searchParams.get('filter') ?? null
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
      <Link href="/" aria-label="Home" className="mb-10 logo-fadein">
        <LogoVideo webmSrc="/videos/logo.webm" mp4Src="/videos/logo.mp4" className="w-[150px]" />
      </Link>

      <ul className="flex flex-col gap-4">
        {navLinks.map((link, index) => (
          <Fragment key={link.href}>
            {index === 3 && <li className="h-3.5" aria-hidden="true" />}
            <li>
              <Link
                href={link.href}
                style={{ fontSize: 'clamp(1.05rem, 0.95rem + 0.5vw, 1.25rem)' }}
                className={cn(
                  'text-[var(--text-secondary)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--text-primary)]',
                  pathname.startsWith(link.href) ? 'font-medium' : 'font-normal'
                )}
              >
                {link.label}
              </Link>
              {link.href === '/direction' && isVideoSection && (
                <ul className="mt-2 flex flex-col gap-1.5 pl-3">
                  {videoSubLinks.map((sub) => {
                    const isActive = activeFilter === sub.filter
                    return (
                      <li key={sub.href}>
                        <Link
                          href={sub.href}
                          style={{ fontSize: 'clamp(0.7rem, 0.65rem + 0.2vw, 0.8rem)' }}
                          className={cn(
                            'uppercase tracking-widest transition-colors duration-[var(--duration-fast)]',
                            isActive
                              ? 'text-[var(--text-primary)] font-medium'
                              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                          )}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          </Fragment>
        ))}
      </ul>
    </nav>
  )
}
