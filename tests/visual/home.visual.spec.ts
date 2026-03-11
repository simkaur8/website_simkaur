import { test, expect } from '@playwright/test'

test('home page hero desktop', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveScreenshot('home-hero-desktop.png', {
    fullPage: false,
    maxDiffPixelRatio: 0.01,
  })
})

test('home page hero mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveScreenshot('home-hero-mobile.png', {
    maxDiffPixelRatio: 0.01,
  })
})
