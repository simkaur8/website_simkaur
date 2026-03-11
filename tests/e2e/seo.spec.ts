import { test, expect } from '@playwright/test'

const pages = [
  { path: '/', name: 'Home' },
  { path: '/direction', name: 'Direction' },
  { path: '/photography', name: 'Photography' },
  { path: '/about', name: 'About' },
]

for (const { path, name } of pages) {
  test.describe(`SEO - ${name}`, () => {
    test(`has a title tag`, async ({ page }) => {
      await page.goto(path)
      const title = await page.title()
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(0)
    })

    test(`has a meta description`, async ({ page }) => {
      await page.goto(path)
      const description = page.locator('meta[name="description"]')
      await expect(description).toHaveAttribute('content', /.+/)
    })
  })
}
