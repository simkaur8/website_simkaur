import { describe, it, expect } from 'vitest'
import { existsSync, readdirSync, statSync } from 'fs'
import path from 'path'

// Max gzipped size estimate per chunk (uncompressed / 3)
// 1500KB accommodates large vendor chunks (Sanity Studio, Framer Motion)
const MAX_GZIPPED_KB = 1500

describe('bundle size', () => {
  it(`no JS chunk exceeds ${MAX_GZIPPED_KB}KB gzipped estimate`, () => {
    const chunksDir = path.join(process.cwd(), '.next/static/chunks')
    if (!existsSync(chunksDir)) return // skip if not built
    const files = readdirSync(chunksDir).filter((f) => f.endsWith('.js'))
    for (const file of files) {
      const size = statSync(path.join(chunksDir, file)).size
      const gzippedEstimate = size / 3
      expect(
        gzippedEstimate,
        `${file} is ~${Math.round(gzippedEstimate / 1024)}KB gzipped (limit: ${MAX_GZIPPED_KB}KB)`
      ).toBeLessThan(MAX_GZIPPED_KB * 1024)
    }
  })
})
