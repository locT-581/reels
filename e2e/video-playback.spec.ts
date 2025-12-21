/**
 * E2E Tests for Video Playback
 */

import { test, expect } from '@playwright/test'

test.describe('Video Feed', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display video feed on home page', async ({ page }) => {
    // Wait for feed to load
    await expect(page.locator('[data-testid="video-feed"]')).toBeVisible({ timeout: 10000 })
  })

  test('should display video player', async ({ page }) => {
    // Wait for video element
    await expect(page.locator('video').first()).toBeVisible({ timeout: 10000 })
  })

  test('should show video controls on tap', async ({ page }) => {
    // Tap video area
    const video = page.locator('video').first()
    await video.click()
    
    // Controls should appear
    await expect(page.locator('[data-testid="play-pause-button"]')).toBeVisible()
  })
})

test.describe('Video Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('video', { timeout: 10000 })
  })

  test('should like video on double tap', async ({ page }) => {
    const video = page.locator('video').first()
    
    // Double tap
    await video.dblclick()
    
    // Heart animation should appear
    await expect(page.locator('[data-testid="double-tap-heart"]')).toBeVisible()
  })

  test('should show action buttons', async ({ page }) => {
    // Like button should be visible
    await expect(page.locator('[data-testid="like-button"]').first()).toBeVisible({ timeout: 5000 })
    
    // Comment button should be visible
    await expect(page.locator('[data-testid="comment-button"]').first()).toBeVisible()
    
    // Share button should be visible
    await expect(page.locator('[data-testid="share-button"]').first()).toBeVisible()
  })

  test('should open comment sheet when clicking comment button', async ({ page }) => {
    // Click comment button
    await page.locator('[data-testid="comment-button"]').first().click()
    
    // Comment sheet should be visible
    await expect(page.locator('[data-testid="comment-sheet"]')).toBeVisible()
  })

  test('should open share sheet when clicking share button', async ({ page }) => {
    // Click share button
    await page.locator('[data-testid="share-button"]').first().click()
    
    // Share sheet should be visible
    await expect(page.locator('[data-testid="share-sheet"]')).toBeVisible()
  })
})

test.describe('Swipe Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('video', { timeout: 10000 })
  })

  test('should navigate to next video on swipe up', async ({ page }) => {
    const feed = page.locator('[data-testid="video-feed"]')
    
    // Get initial video
    const initialVideoId = await page.locator('[data-testid="current-video-id"]').textContent()
    
    // Swipe up
    await feed.evaluate((el) => {
      el.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
    })
    
    // Wait for scroll to complete
    await page.waitForTimeout(500)
    
    // Video should change
    const newVideoId = await page.locator('[data-testid="current-video-id"]').textContent()
    expect(newVideoId).not.toBe(initialVideoId)
  })
})

test.describe('Offline Mode', () => {
  test('should show offline indicator when network is disconnected', async ({ page, context }) => {
    await page.goto('/')
    
    // Go offline
    await context.setOffline(true)
    
    // Offline indicator should appear
    await expect(page.locator('[data-testid="offline-indicator"]')).toBeVisible({ timeout: 5000 })
  })

  test('should navigate to offline page when offline', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true)
    
    // Navigate to a page
    await page.goto('/some-page').catch(() => {})
    
    // Should show offline content
    await expect(page.getByText(/không có kết nối/i)).toBeVisible({ timeout: 5000 })
  })
})

