'use client'

import { useState } from 'react'
import { FilterBar } from '@/components/ui/FilterBar'

const filters = [
  { value: 'all', label: 'All' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'portraits', label: 'Portraits' },
  { value: 'event', label: 'Event' },
  { value: 'life', label: 'Life' },
]

export function PhotographyGrid() {
  const [activeFilter, setActiveFilter] = useState('all')

  return (
    <div>
      <div className="mb-8 flex justify-center">
        <FilterBar
          filters={filters}
          active={activeFilter}
          onChange={setActiveFilter}
          variant="direction"
        />
      </div>

      {/* Photos will be populated from Sanity */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {/* Empty state */}
      </div>
      <p className="py-24 text-center text-[var(--text-muted)]">No photos yet.</p>
    </div>
  )
}
