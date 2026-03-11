import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const pages = [
  { path: '/', name: 'Home' },
  { path: '/direction', name: 'Direction' },
  { path: '/about', name: 'About' },
]

for (const { path, name } of pages) {
  test(`${name} page has no critical accessibility violations`, async ({ page }) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()

    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )

    expect(critical).toHaveLength(0)
  })
}
