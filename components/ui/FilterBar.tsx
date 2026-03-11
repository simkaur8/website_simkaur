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
  variant?: 'direction' | 'photography'
}

export function FilterBar({
  filters,
  active,
  onChange,
  className,
  variant = 'direction',
}: FilterBarProps) {
  if (variant === 'photography') {
    return (
      <nav
        className={cn('flex items-center gap-3 flex-wrap', className)}
        role="navigation"
        aria-label="Filter"
      >
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => onChange(filter.value)}
            className={cn(
              'rounded-full border px-5 py-2 text-[var(--text-xs)] uppercase tracking-[0.12em] transition-colors duration-200',
              filter.value === active
                ? 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)]'
                : 'border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]'
            )}
            aria-pressed={filter.value === active}
          >
            {filter.label}
          </button>
        ))}
      </nav>
    )
  }

  return (
    <nav
      className={cn('flex items-center gap-2 flex-wrap', className)}
      role="navigation"
      aria-label="Filter"
    >
      {filters.map((filter, index) => (
        <span key={filter.value} className="flex items-center gap-2">
          {index > 0 && (
            <span className="text-[var(--text-muted)] select-none" aria-hidden="true">
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => onChange(filter.value)}
            className={cn(
              'text-[var(--text-xs)] uppercase tracking-[0.12em] transition-colors duration-200',
              filter.value === active
                ? 'border border-[var(--text-primary)] rounded-[4px] px-[1.1em] py-[0.5em] text-[var(--text-primary)]'
                : 'px-[1.1em] py-[0.5em] text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
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
