import { describe, it } from 'vitest'
import * as fc from 'fast-check'
import { ensureAbsoluteUrl } from '@/lib/utils'

describe('image URL properties', () => {
  it('relative paths become absolute', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => !s.startsWith('http') && s.length > 0),
        (path) => {
          const result = ensureAbsoluteUrl(path)
          return result.startsWith('https://simkaur.art')
        }
      )
    )
  })
})
