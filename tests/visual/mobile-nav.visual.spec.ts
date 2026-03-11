import { test, expect } from '@playwright/test'

test('mobile nav drawer open', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  const hamburger = page.getByRole('button', { name: /menu/i })
  await hamburger.click()
  await page.waitForTimeout(500)
  await expect(page).toHaveScreenshot('mobile-nav-open.png', {
    maxDiffPixelRatio: 0.01,
  })
})
