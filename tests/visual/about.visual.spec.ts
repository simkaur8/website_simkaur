import { test, expect } from '@playwright/test'

test('about page desktop', async ({ page }) => {
  await page.goto('/about')
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveScreenshot('about-desktop.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  })
})
