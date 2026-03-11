import { test, expect } from '@playwright/test'

test('home page dark mode (default)', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveScreenshot('home-dark-mode.png', {
    maxDiffPixelRatio: 0.01,
  })
})

test('home page light mode (toggled)', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const themeToggle = page.getByRole('button', { name: /theme/i })
  await themeToggle.click()
  await page.waitForTimeout(500)
  await expect(page).toHaveScreenshot('home-light-mode.png', {
    maxDiffPixelRatio: 0.01,
  })
})
