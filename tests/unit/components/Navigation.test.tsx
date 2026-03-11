import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SideNav } from '@/components/nav/SideNav'
import { MobileNav } from '@/components/nav/MobileNav'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: Record<string, unknown>) => (
    <a href={href as string} {...props}>
      {children as React.ReactNode}
    </a>
  ),
}))

// Mock framer-motion to render without animations
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

describe('SideNav', () => {
  it('renders all nav links', () => {
    render(<SideNav />)
    expect(screen.getByText('Direction')).toBeInTheDocument()
    expect(screen.getByText('Photography')).toBeInTheDocument()
    expect(screen.getByText('Exhibitions')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('renders nav element with correct role', () => {
    render(<SideNav />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('links have correct hrefs', () => {
    render(<SideNav />)
    expect(screen.getByText('Direction').closest('a')).toHaveAttribute('href', '/direction')
    expect(screen.getByText('Photography').closest('a')).toHaveAttribute('href', '/photography')
    expect(screen.getByText('Exhibitions').closest('a')).toHaveAttribute('href', '/exhibitions')
    expect(screen.getByText('About').closest('a')).toHaveAttribute('href', '/about')
  })
})

describe('MobileNav', () => {
  it('renders hamburger button', () => {
    render(<MobileNav />)
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument()
  })

  it('opens drawer on hamburger click', () => {
    render(<MobileNav />)
    fireEvent.click(screen.getByRole('button', { name: /menu/i }))
    expect(screen.getByText('Direction')).toBeInTheDocument()
    expect(screen.getByText('Photography')).toBeInTheDocument()
    expect(screen.getByText('Exhibitions')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
  })

  it('closes drawer on link click', () => {
    render(<MobileNav />)
    fireEvent.click(screen.getByRole('button', { name: /menu/i }))
    fireEvent.click(screen.getByText('Direction'))
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
  })
})
