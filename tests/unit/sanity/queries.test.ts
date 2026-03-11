import { describe, it, expect } from 'vitest'
import * as queries from '@/sanity/lib/queries'

describe('Sanity GROQ queries', () => {
  it('exports all required queries', () => {
    expect(queries.allProjectsQuery).toBeDefined()
    expect(queries.projectBySlugQuery).toBeDefined()
    expect(queries.allPhotoCollectionsQuery).toBeDefined()
    expect(queries.photoCollectionByCategoryQuery).toBeDefined()
    expect(queries.allExhibitionsQuery).toBeDefined()
    expect(queries.exhibitionBySlugQuery).toBeDefined()
    expect(queries.siteSettingsQuery).toBeDefined()
    expect(queries.linkInBioQuery).toBeDefined()
  })

  it('project queries order by sortOrder', () => {
    expect(queries.allProjectsQuery).toContain('order(sortOrder asc)')
  })

  it('projectBySlug query filters by slug', () => {
    expect(queries.projectBySlugQuery).toContain('slug.current == $slug')
  })

  it('photoCollection query filters by category', () => {
    expect(queries.photoCollectionByCategoryQuery).toContain('category == $category')
  })

  it('siteSettings query fetches singleton', () => {
    expect(queries.siteSettingsQuery).toContain('_type == "siteSettings"')
  })
})
