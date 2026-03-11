import { test, expect } from '@playwright/test'

test.describe('Photography page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/photography')
  })

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/photography/)
  })

  test('has a heading', async ({ page }) => {
    const heading = page.getByRole('heading').first()
    await expect(heading).toBeVisible()
  })

  test('has a main content area', async ({ page }) => {
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })
})
