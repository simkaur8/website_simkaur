import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { ThemeToggle } from '@/components/ThemeToggle'

describe('ThemePersistence – integration', () => {
  beforeEach(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    localStorage.clear()
  })

  it('ThemeToggle renders', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /toggle theme/i })).toBeInTheDocument()
  })

  it('clicking toggle changes data-theme attribute on html element', () => {
    render(<ThemeToggle />)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')

    fireEvent.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('theme preference is saved to localStorage', () => {
    render(<ThemeToggle />)
    fireEvent.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(localStorage.getItem('theme')).toBe('light')

    fireEvent.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(localStorage.getItem('theme')).toBe('dark')
  })

  it('on re-render with stored preference, theme persists', () => {
    // Set localStorage before rendering to simulate returning user
    localStorage.setItem('theme', 'light')
    document.documentElement.setAttribute('data-theme', 'light')

    render(<ThemeToggle />)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    // Unmount and re-render to verify persistence
    cleanup()
    render(<ThemeToggle />)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })
})
