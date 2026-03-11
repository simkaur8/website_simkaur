import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterBar } from '@/components/ui/FilterBar'

describe('FilterBar', () => {
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'fashion-dance', label: 'Fashion & Dance' },
    { value: 'music-videos', label: 'Music Videos' },
  ]

  it('renders all filter buttons', () => {
    render(<FilterBar filters={filters} active="all" onChange={() => {}} />)
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Fashion & Dance')).toBeInTheDocument()
    expect(screen.getByText('Music Videos')).toBeInTheDocument()
  })

  it('shows active state on selected filter', () => {
    render(<FilterBar filters={filters} active="fashion-dance" onChange={() => {}} />)
    const active = screen.getByText('Fashion & Dance')
    expect(active.className).toContain('text-') // has active styling
  })

  it('calls onChange with filter value on click', () => {
    const onChange = vi.fn()
    render(<FilterBar filters={filters} active="all" onChange={onChange} />)
    fireEvent.click(screen.getByText('Music Videos'))
    expect(onChange).toHaveBeenCalledWith('music-videos')
  })
})
