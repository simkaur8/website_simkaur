import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { buildPageTitle, ensureAbsoluteUrl } from '@/lib/utils'

describe('metadata properties', () => {
  it('page title is never empty', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (title) => {
        return buildPageTitle(title).length > 0
      })
    )
  })

  it('page title always ends with Sim Kaur', () => {
    fc.assert(
      fc.property(fc.string(), (title) => {
        return buildPageTitle(title).endsWith('Sim Kaur')
      })
    )
  })

  it('ensureAbsoluteUrl always returns absolute URL', () => {
    fc.assert(
      fc.property(fc.webUrl(), (url) => {
        return ensureAbsoluteUrl(url).startsWith('http')
      })
    )
  })

  it('ensureAbsoluteUrl is idempotent on absolute URLs', () => {
    fc.assert(
      fc.property(fc.webUrl(), (url) => {
        return ensureAbsoluteUrl(url) === url
      })
    )
  })
})
