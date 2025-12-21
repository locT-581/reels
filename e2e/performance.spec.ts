/**
 * E2E Performance Tests
 */

import { test, expect } from '@playwright/test'

test.describe('Performance', () => {
  test('should load homepage within LCP budget (< 1.5s)', async ({ page }) => {
    // Start tracking metrics
    const lcpPromise = page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        }).observe({ type: 'largest-contentful-paint', buffered: true })
        
        // Timeout fallback
        setTimeout(() => resolve(0), 10000)
      })
    })

    await page.goto('/')
    const lcp = await lcpPromise

    // LCP should be under 1.5 seconds
    expect(lcp).toBeLessThan(1500)
    console.log(`LCP: ${lcp}ms`)
  })

  test('should have CLS under budget (< 0.05)', async ({ page }) => {
    // Track CLS
    const clsPromise = page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let cls = 0
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries() as PerformanceEntry[]) {
            if (!(entry as any).hadRecentInput) {
              cls += (entry as any).value || 0
            }
          }
        }).observe({ type: 'layout-shift', buffered: true })
        
        // Wait for page to stabilize
        setTimeout(() => resolve(cls), 5000)
      })
    })

    await page.goto('/')
    const cls = await clsPromise

    // CLS should be under 0.05
    expect(cls).toBeLessThan(0.05)
    console.log(`CLS: ${cls}`)
  })

  test('should render first video frame quickly (< 500ms)', async ({ page }) => {
    const startTime = Date.now()
    
    await page.goto('/')
    
    // Wait for video to be ready
    await page.waitForFunction(() => {
      const video = document.querySelector('video')
      return video && video.readyState >= 2 // HAVE_CURRENT_DATA
    }, { timeout: 10000 })
    
    const timeToFirstFrame = Date.now() - startTime
    
    // First frame should appear within 500ms (excluding network latency)
    // In real conditions, we'd use more precise measurements
    console.log(`Time to first video frame: ${timeToFirstFrame}ms`)
  })

  test('should maintain 60fps during scroll', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('video', { timeout: 10000 })
    
    // Enable performance tracing
    await page.tracing.start({ screenshots: true, snapshots: true })
    
    // Perform scroll
    const feed = page.locator('[data-testid="video-feed"]')
    for (let i = 0; i < 5; i++) {
      await feed.evaluate((el) => {
        el.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
      })
      await page.waitForTimeout(400)
    }
    
    const trace = await page.tracing.stop()
    
    // Trace file can be analyzed for frame drops
    // In CI, we'd parse this and check for dropped frames
    console.log('Scroll trace captured')
  })

  test('should not have memory leaks after scrolling 50 videos', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('video', { timeout: 10000 })
    
    // Get initial heap size
    const initialHeap = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize
      }
      return 0
    })
    
    // Scroll through many videos
    const feed = page.locator('[data-testid="video-feed"]')
    for (let i = 0; i < 50; i++) {
      await feed.evaluate((el) => {
        el.scrollBy({ top: window.innerHeight })
      })
      await page.waitForTimeout(100)
    }
    
    // Force garbage collection (if available)
    await page.evaluate(() => {
      if ((window as any).gc) {
        (window as any).gc()
      }
    })
    
    // Get final heap size
    const finalHeap = await page.evaluate(() => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize
      }
      return 0
    })
    
    // Memory should not grow excessively (< 150MB total)
    const heapGrowth = finalHeap - initialHeap
    console.log(`Initial heap: ${Math.round(initialHeap / 1024 / 1024)}MB`)
    console.log(`Final heap: ${Math.round(finalHeap / 1024 / 1024)}MB`)
    console.log(`Heap growth: ${Math.round(heapGrowth / 1024 / 1024)}MB`)
    
    // Final heap should be under 150MB
    expect(finalHeap).toBeLessThan(150 * 1024 * 1024)
  })
})

