import { test, expect } from '@playwright/test'

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has a visible heading', async ({ page }) => {
    const heading = page.getByRole('heading').first()
    await expect(heading).toBeVisible()
  })

  test('has a main element', async ({ page }) => {
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('renders without console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(err.message))
    await page.goto('/')
    await page.waitForTimeout(1000)
    expect(errors).toHaveLength(0)
  })
})
