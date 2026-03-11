import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SideNav } from '@/components/nav/SideNav'
import { MobileNav } from '@/components/nav/MobileNav'

// Mock next/navigation
let mockPathname = '/'
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: Record<string, unknown>) => (
    <a href={href as string} {...props}>
      {children as React.ReactNode}
    </a>
  ),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, exit, transition, ...rest }: Record<string, unknown>) => {
      void initial
      void animate
      void exit
      void transition
      return <div {...rest}>{children as React.ReactNode}</div>
    },
  },
  AnimatePresence: ({ children }: Record<string, unknown>) => <>{children as React.ReactNode}</>,
}))

// Mock LogoVideo
vi.mock('@/components/nav/LogoVideo', () => ({
  LogoVideo: ({ className }: { className?: string }) => (
    <div data-testid="logo-video" className={className} />
  ),
}))

describe('SideNav – integration', () => {
  it('renders all nav links (Direction, Photography, Exhibitions, About) plus Home logo', () => {
    render(<SideNav />)
    expect(screen.getByLabelText('Home')).toBeInTheDocument()
    expect(screen.getByText('Direction')).toBeInTheDocument()
    expect(screen.getByText('Photography')).toBeInTheDocument()
    expect(screen.getByText('Exhibitions')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('active link gets accent styling when pathname matches', () => {
    mockPathname = '/direction'
    render(<SideNav />)
    const directionLink = screen.getByText('Direction')
    expect(directionLink.className).toContain('text-[var(--accent)]')

    // Other links should have muted styling
    const photoLink = screen.getByText('Photography')
    expect(photoLink.className).toContain('text-[var(--text-muted)]')

    // Reset
    mockPathname = '/'
  })
})

describe('MobileNav – integration', () => {
  it('renders hamburger button', () => {
    render(<MobileNav />)
    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument()
  })

  it('clicking hamburger opens the drawer with all links', () => {
    render(<MobileNav />)
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Direction')).toBeInTheDocument()
    expect(screen.getByText('Photography')).toBeInTheDocument()
    expect(screen.getByText('Exhibitions')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument()
  })

  it('clicking a link in the drawer closes it', () => {
    render(<MobileNav />)
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    fireEvent.click(screen.getByText('Direction'))
    expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument()
  })

  it('Escape key closes the drawer', () => {
    render(<MobileNav />)
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument()
  })
})
