/**
 * @vortex/feed - Hooks
 */

export { useVideoVisibility, type UseVideoVisibilityOptions, type UseVideoVisibilityReturn } from './useVideoVisibility'
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
export { useFeedScroll, type UseFeedScrollOptions, type UseFeedScrollReturn } from './useFeedScroll'
export { useInfiniteScroll, type UseInfiniteScrollOptions, type UseInfiniteScrollReturn } from './useInfiniteScroll'

// API integration hook
export { useVideoFeed, prefetchVideoFeed, type UseVideoFeedOptions, type UseVideoFeedReturn } from './useVideoFeed'

// High-performance animation hook
export { useSwipeAnimation, type UseSwipeAnimationOptions, type UseSwipeAnimationReturn } from './useSwipeAnimation'

