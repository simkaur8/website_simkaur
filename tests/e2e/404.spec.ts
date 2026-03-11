import { test, expect } from '@playwright/test'

test.describe('404 page', () => {
  test('shows 404 content for nonexistent route', async ({ page }) => {
    await page.goto('/nonexistent')
    await expect(page.getByText('404')).toBeVisible()
  })

  test('has a link back to home', async ({ page }) => {
    await page.goto('/nonexistent')
    const homeLink = page.getByRole('link', { name: /home/i })
    await expect(homeLink).toBeVisible()
    await homeLink.click()
    await expect(page).toHaveURL('/')
  })
})
