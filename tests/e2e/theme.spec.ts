import { test, expect } from '@playwright/test'

test.describe('Theme toggle', () => {
  test('toggles data-theme attribute on html element', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')

    const initialTheme = await html.getAttribute('data-theme')
    expect(initialTheme).toBeTruthy()

    const toggleButton = page.getByRole('button', { name: /theme/i })
    if (await toggleButton.isVisible()) {
      await toggleButton.click()
      const newTheme = await html.getAttribute('data-theme')
      expect(newTheme).not.toBe(initialTheme)
    }
  })

  test('persists theme preference across reload', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')

    const toggleButton = page.getByRole('button', { name: /theme/i })
    if (await toggleButton.isVisible()) {
      await toggleButton.click()
      const themeAfterToggle = await html.getAttribute('data-theme')

      await page.reload()
      const themeAfterReload = await page.locator('html').getAttribute('data-theme')
      expect(themeAfterReload).toBe(themeAfterToggle)
    }
  })
})
