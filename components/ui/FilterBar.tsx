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
      className={cn('flex items-center justify-center gap-1 sm:gap-2 flex-nowrap', className)}
      role="navigation"
      aria-label="Filter"
    >
      {filters.map((filter, index) => (
        <span key={filter.value} className="flex items-center gap-1 sm:gap-2">
          {index > 0 && (
            <span className="text-[var(--text-muted)] select-none" aria-hidden="true">
              /
            </span>
          )}
          <button
            type="button"
            onClick={() => onChange(filter.value)}
            style={{ fontSize: 'clamp(0.6rem, 0.55rem + 0.2vw, 0.75rem)' }}
            className={cn(
              'uppercase tracking-[0.1em] sm:tracking-[0.12em] transition-colors duration-200 rounded-[4px] px-[0.7em] sm:px-[1.1em] py-[0.5em] border whitespace-nowrap',
              filter.value === active
                ? 'border-[var(--text-primary)] text-[var(--text-primary)] font-medium'
                : 'border-transparent text-[var(--text-muted)] hover:border-[var(--border)] hover:text-[var(--text-primary)]'
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
