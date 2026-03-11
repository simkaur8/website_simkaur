import '@testing-library/jest-dom/vitest'

// Mock IntersectionObserver for framer-motion viewport animations
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver
