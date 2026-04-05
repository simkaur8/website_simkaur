'use client'

import { useEffect, useSyncExternalStore } from 'react'

// Module-level theme store — avoids setState-in-effect pattern
let _theme: 'dark' | 'light' | null = null
const _listeners = new Set<() => void>()

function getThemeSnapshot(): 'dark' | 'light' {
  if (_theme === null) {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
    _theme = stored === 'light' ? 'light' : 'dark'
  }
  return _theme
}

function subscribeToTheme(cb: () => void) {
  _listeners.add(cb)
  return () => _listeners.delete(cb)
}

function setModuleTheme(next: 'dark' | 'light') {
  _theme = next
  _listeners.forEach((cb) => cb())
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => 'dark' as const)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setModuleTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative flex h-11 w-11 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
    >
      {theme === 'dark' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
