import { test, expect } from '@playwright/test'

test.describe('Direction page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/direction')
  })

  test('page loads successfully', async ({ page }) => {
    await expect(page).toHaveURL(/\/direction/)
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
