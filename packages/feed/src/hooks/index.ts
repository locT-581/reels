/**
 * @xhub-reel/feed - Hooks
 *
 * IntersectionObserver Usage Guide:
 * ---------------------------------
 * - useVideoVisibility: Standalone visibility tracking (analytics, lazy loading)
 * - useVideoActivation: Video play/pause control
 *   - Carousel mode (default): Index-based, no IntersectionObserver
 *   - Scroll mode (trackVisibility: true): Uses IntersectionObserver
 * - useInfiniteScroll: Load more content when sentinel is visible
 */

// Visibility tracking via IntersectionObserver
// Use for: Analytics, lazy loading, scroll-based feeds
export { useVideoVisibility, type UseVideoVisibilityOptions, type UseVideoVisibilityReturn } from './useVideoVisibility'

// Video activation control
// Default: Index-based (carousel) | trackVisibility: true for scroll-based
export { useVideoActivation, type UseVideoActivationOptions, type UseVideoActivationReturn } from './useVideoActivation'
// Preloader: Re-exports core hook + feed-specific helpers
// Only exports domain-specific abstractions, not internal implementation types
export {
  usePreload,
  type UsePreloadOptions,
  type UsePreloadReturn,
  // Feed-specific priority helpers
  getPreloadPriorityForFeed,
  mapPriorityToNumeric,
  getPreloadPriority,
  type PreloadPriority, // Domain-specific priority enum
} from './usePreloader'
export { useMemoryManager, useGlobalMemoryState, type UseMemoryManagerOptions, type UseMemoryManagerReturn } from './useMemoryManager'

// Infinite scroll via IntersectionObserver
// Use for: Loading more videos when approaching end of feed
export { useInfiniteScroll, type UseInfiniteScrollOptions, type UseInfiniteScrollReturn } from './useInfiniteScroll'

// API integration hook
export { useVideoFeed, prefetchVideoFeed, type UseVideoFeedOptions, type UseVideoFeedReturn } from './useVideoFeed'

// High-performance animation hook
export { useSwipeAnimation, type UseSwipeAnimationOptions, type UseSwipeAnimationReturn } from './useSwipeAnimation'

// Video Engine Pool - High-performance preloading for instant playback
export {
  VideoEnginePoolProvider,
  useVideoEnginePool,
  useVideoEnginePoolOptional,
  usePoolOrchestration,
  usePooledVideo,
  usePoolStats,
  usePoolMemoryControl,
  type VideoEnginePoolProviderProps,
  type VideoEnginePoolOptions,
  type EngineSlot,
  type SlotState,
  type PlatformConfig,
} from './useVideoEnginePool'

