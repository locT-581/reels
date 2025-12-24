/**
 * usePreloader - Feed-specific video preloading layer
 *
 * ARCHITECTURE:
 * This module re-exports core preload functionality from @xhub-reel/player-core
 * and adds FEED-SPECIFIC abstractions:
 * - PreloadPriority type (high/medium/low/metadata/none)
 * - Priority calculation helpers based on video index distance
 *
 * LAYERED DESIGN (Big Tech Pattern):
 * ┌─────────────────────────────────────────┐
 * │ @xhub-reel/feed (Domain Layer)             │
 * │ - Feed-specific priority enum           │
 * │ - Distance-based priority calculation   │
 * └──────────────┬──────────────────────────┘
 *                │ re-exports + extends
 *                ↓
 * ┌─────────────────────────────────────────┐
 * │ @xhub-reel/player (UI Layer)               │
 * │ - Re-exports core + UI components       │
 * └──────────────┬──────────────────────────┘
 *                │ re-exports
 *                ↓
 * ┌─────────────────────────────────────────┐
 * │ @xhub-reel/player-core (Core Layer)        │
 * │ - usePreload hook                       │
 * │ - PreloadManager service                │
 * │ - Generic, reusable logic               │
 * └─────────────────────────────────────────┘
 *
 * FEED PRELOAD STRATEGY:
 * - Current - 1: Keep in memory, paused
 * - Current: Playing
 * - Current + 1: Pre-load first 3 segments (high)
 * - Current + 2: Pre-load first segment (medium)
 * - Current + 3: Fetch metadata only (low)
 * - Current ± 4+: Dispose (none)
 */

'use client'

// Re-export core preload hook from @xhub-reel/player
// Feed layer does NOT expose internal types (PreloadItem, PreloadStatus)
// as these are implementation details. Consumers should use PreloadPriority.
export {
  usePreload,
  type UsePreloadOptions,
  type UsePreloadReturn,
} from '@xhub-reel/player'

/**
 * Priority levels for feed preloading
 */
export type PreloadPriority = 'high' | 'medium' | 'low' | 'metadata' | 'none'

/**
 * Calculate preload priority based on distance from current video
 *
 * @param index - Video index to check
 * @param currentIndex - Current active video index
 * @returns Numeric priority (1 = highest, 10 = none/dispose)
 */
export function getPreloadPriorityForFeed(
  index: number,
  currentIndex: number
): number {
  const distance = Math.abs(index - currentIndex)

  if (distance === 0) return 1      // Current - highest priority
  if (distance === 1) return 3      // Adjacent (prev/next)
  if (distance === 2) return 5      // Near
  if (distance === 3) return 7      // Metadata only
  return 10                          // None/dispose
}

/**
 * Map PreloadPriority enum to numeric priority
 *
 * @param priority - Priority enum
 * @returns Numeric priority for PreloadManager
 */
export function mapPriorityToNumeric(priority: PreloadPriority): number {
  switch (priority) {
    case 'high':
      return 1
    case 'medium':
      return 3
    case 'low':
      return 5
    case 'metadata':
      return 7
    default:
      return 10
  }
}

/**
 * Get PreloadPriority enum based on distance from current
 *
 * @param index - Video index to check
 * @param currentIndex - Current active video index
 * @returns PreloadPriority enum
 */
export function getPreloadPriority(
  index: number,
  currentIndex: number
): PreloadPriority {
  const distance = index - currentIndex

  if (distance === 0) return 'high'       // Current
  if (distance === -1) return 'high'      // Previous
  if (distance === 1) return 'high'       // Next (preload 3 segments)
  if (distance === 2) return 'medium'     // +2 (preload 1 segment)
  if (distance === 3) return 'low'        // +3 (metadata only)
  if (Math.abs(distance) <= 5) return 'metadata'

  return 'none' // Dispose
}
