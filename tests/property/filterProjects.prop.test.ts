import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { filterProjects } from '@/lib/utils'

describe('filterProjects properties', () => {
  const projectArb = fc.record({
    title: fc.string(),
    category: fc.oneof(fc.constant('fashion-dance'), fc.constant('music-video')),
  })

  it('result is always a subset of input', () => {
    fc.assert(
      fc.property(fc.array(projectArb), fc.string(), (projects, filter) => {
        const result = filterProjects(projects, filter)
        return result.length <= projects.length
      })
    )
  })

  it('"all" filter always returns full array', () => {
    fc.assert(
      fc.property(fc.array(projectArb), (projects) => {
        return filterProjects(projects, 'all').length === projects.length
      })
    )
  })

  it('every result item matches the filter', () => {
    fc.assert(
      fc.property(fc.array(projectArb), fc.string(), (projects, filter) => {
        if (filter === 'all') return true
        const result = filterProjects(projects, filter)
        return result.every((p) => p.category === filter)
      })
    )
  })
})
