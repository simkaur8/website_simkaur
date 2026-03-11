import { describe, it, expect } from 'vitest'
import { formatCredits } from '@/lib/utils'

describe('formatCredits', () => {
  it('formats single credit', () => {
    expect(formatCredits([{ role: 'Director', name: 'Sim Kaur' }])).toBe('Director: Sim Kaur')
  })
  it('formats multiple credits', () => {
    const result = formatCredits([
      { role: 'Director', name: 'Sim Kaur' },
      { role: 'DOP', name: 'John Doe' },
    ])
    expect(result).toBe('Director: Sim Kaur\nDOP: John Doe')
  })
  it('returns empty string for empty array', () => {
    expect(formatCredits([])).toBe('')
  })
})
