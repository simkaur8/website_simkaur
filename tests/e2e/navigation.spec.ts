import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('home page loads and has correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Sim Kaur/)
  })

  test('navigates to Direction page', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: /direction/i })
      .first()
      .click()
    await expect(page).toHaveURL(/\/direction/)
  })

  test('navigates to Photography page', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('link', { name: /photography/i })
      .first()
      .click()
    await expect(page).toHaveURL(/\/photography/)
  })

  test('navigates to About page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /about/i }).first().click()
    await expect(page).toHaveURL(/\/about/)
  })
})

test.describe('Mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test('hamburger menu opens and shows nav links', async ({ page }) => {
    await page.goto('/')
    const menuButton = page.getByRole('button', { name: /menu|nav/i })
    if (await menuButton.isVisible()) {
      await menuButton.click()
      await expect(page.getByRole('link', { name: /direction/i })).toBeVisible()
    }
  })
})
