'use client'

import { cn } from '@/lib/utils'

interface FilterOption {
  value: string
  label: string
}

interface FilterBarProps {
  filters: FilterOption[]
  active: string
  onChange: (value: string) => void
  className?: string
}

export function FilterBar({ filters, active, onChange, className }: FilterBarProps) {
  return (
    <nav
      className={cn('flex items-center gap-2 flex-wrap', className)}
      role="navigation"
      aria-label="Filter"
    >
      {filters.map((filter, index) => (
        <span key={filter.value} className="flex items-center gap-2">
          {index > 0 && (
            <span className="text-muted select-none" aria-hidden="true">
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => onChange(filter.value)}
            className={cn(
              'transition-colors duration-200',
              filter.value === active ? 'text-primary' : 'text-muted hover:text-secondary'
            )}
            aria-pressed={filter.value === active}
          >
            {filter.label}
          </button>
        </span>
      ))}
    </nav>
  )
}
