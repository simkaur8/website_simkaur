import { test, expect } from '@playwright/test'

test('direction page grid desktop', async ({ page }) => {
  await page.goto('/direction')
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveScreenshot('direction-grid-desktop.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  })
})

test('direction page grid tablet', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 })
  await page.goto('/direction')
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveScreenshot('direction-grid-tablet.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.01,
  })
})
