import { describe, it, expect } from 'vitest'
import { filterProjects } from '@/lib/utils'

const mockProjects = [
  { title: 'A', category: 'fashion-dance' },
  { title: 'B', category: 'music-video' },
  { title: 'C', category: 'fashion-dance' },
]

describe('filterProjects', () => {
  it('returns all projects when filter is "all"', () => {
    expect(filterProjects(mockProjects, 'all')).toHaveLength(3)
  })
  it('filters by category', () => {
    expect(filterProjects(mockProjects, 'fashion-dance')).toHaveLength(2)
  })
  it('returns empty array for unknown category', () => {
    expect(filterProjects(mockProjects, 'unknown')).toHaveLength(0)
  })
  it('returns empty array for empty input', () => {
    expect(filterProjects([], 'all')).toHaveLength(0)
  })
})
