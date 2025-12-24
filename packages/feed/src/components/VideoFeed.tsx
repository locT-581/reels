/**
 * VideoFeed - High-performance video carousel with gesture-based navigation
 *
 * Performance optimizations:
 * - Only 3 DOM nodes at any time (prev, current, next) - minimal memory
 * - Direct DOM manipulation for swipe animation (bypasses React)
 * - RAF batching for smooth 60fps animation
 * - Cached viewport height (no layout thrashing)
 * - transitionend events (no setTimeout race conditions)
 * - Design system spring easing
 */

'use client'

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
  type CSSProperties,
} from 'react'
import { useFeedStore, colors, radii, zIndices, mergeStyles } from '@xhub-reel/core'
import type { Video } from '@xhub-reel/core'
import { useVerticalSwipe } from '@xhub-reel/gestures'
import { VideoFeedItem } from './VideoFeedItem'
import { getPreloadPriority } from '../hooks/usePreloader'
import { useSwipeAnimation } from '../hooks/useSwipeAnimation'

// =============================================================================
// TYPES
// =============================================================================

export interface VideoFeedProps {
  /** Videos to display */
  videos: Video[]
  /** Initial video index */
  initialIndex?: number
  /** Called when more videos should be loaded */
  onLoadMore?: () => void | Promise<void>
  /** Called when the current video changes */
  onVideoChange?: (video: Video, index: number) => void
  /** Called when a video is liked */
  onLike?: (video: Video) => void
  /** Called when comments should be shown */
  onComment?: (video: Video) => void
  /** Called when share sheet should be shown */
  onShare?: (video: Video) => void
  /** Called when author profile should be shown */
  onAuthorClick?: (video: Video) => void
  /** Loading state */
  isLoading?: boolean
  /** Has more videos to load */
  hasMore?: boolean
  /** Threshold to trigger load more (videos before end) */
  loadMoreThreshold?: number
  /** Animation duration in ms */
  transitionDuration?: number
  /** Swipe threshold in pixels */
  swipeThreshold?: number
  /** Swipe velocity threshold in px/ms */
  velocityThreshold?: number
  /** Disable swipe gestures */
  gesturesDisabled?: boolean
  /** Enable haptic feedback on swipe */
  hapticEnabled?: boolean
  /** Custom styles override */
  style?: CSSProperties
  /** Custom className (for external CSS if needed) */
  className?: string
}

export interface VideoFeedRef {
  slideTo: (index: number, animated?: boolean) => void
  slideNext: (animated?: boolean) => void
  slidePrev: (animated?: boolean) => void
  activeIndex: number
  totalSlides: number
  isBeginning: boolean
  isEnd: boolean
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_TRANSITION_DURATION = 300
const DEFAULT_SWIPE_THRESHOLD = 50
const DEFAULT_VELOCITY_THRESHOLD = 0.3

/** Design system spring easing */
const SPRING_EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'

// =============================================================================
// STYLES
// =============================================================================

const feedStyles = {
  container: {
    position: 'fixed' as const,
    inset: 0,
    overflow: 'hidden',
    backgroundColor: colors.background,
    touchAction: 'none', // Prevent browser gestures, @use-gesture handles all
    userSelect: 'none',
    WebkitUserSelect: 'none',
  } satisfies CSSProperties,

  track: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    willChange: 'transform',
  } satisfies CSSProperties,

  slide: {
    position: 'absolute' as const,
    left: 0,
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden' as const,
    WebkitBackfaceVisibility: 'hidden' as const,
  } satisfies CSSProperties,

  loadingIndicator: {
    position: 'absolute' as const,
    bottom: 80,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    zIndex: zIndices.base,
    pointerEvents: 'none' as const,
  } satisfies CSSProperties,

  spinner: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: colors.text,
    borderRadius: radii.full,
    animation: 'xhub-reel-spin 1s linear infinite',
  } satisfies CSSProperties,
}

// =============================================================================
// COMPONENT
// =============================================================================

export const VideoFeed = forwardRef<VideoFeedRef, VideoFeedProps>(
  (
    {
      videos,
      initialIndex = 0,
      onLoadMore,
      onVideoChange,
      onLike,
      onComment,
      onShare,
      onAuthorClick,
      isLoading = false,
      hasMore = false,
      loadMoreThreshold = 3,
      transitionDuration = DEFAULT_TRANSITION_DURATION,
      swipeThreshold = DEFAULT_SWIPE_THRESHOLD,
      velocityThreshold = DEFAULT_VELOCITY_THRESHOLD,
      gesturesDisabled = false,
      hapticEnabled = true,
      style,
      className = '',
    },
    ref
  ) => {
    // ==========================================================================
    // STATE & REFS
    // ==========================================================================

    const [currentIndex, setCurrentIndex] = useState(() =>
      Math.min(Math.max(0, initialIndex), Math.max(0, videos.length - 1))
    )
    const [isLocked, setIsLocked] = useState(false) // Lock during transitions
    const [isAnimating, setIsAnimating] = useState(false) // Track animation state for isActive

    const containerRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)

    // Data refs (avoid stale closures)
    const videosRef = useRef(videos)
    const currentIndexRef = useRef(currentIndex)
    const isLoadingRef = useRef(isLoading)
    const hasMoreRef = useRef(hasMore)
    const isLockedRef = useRef(isLocked)

    const { setCurrentIndex: storeSetCurrentIndex } = useFeedStore()

    // ==========================================================================
    // HIGH-PERFORMANCE ANIMATION HOOK
    // ==========================================================================

    const {
      setTranslateY,      // Direct DOM manipulation, RAF batched
      animateTo,          // CSS transition with transitionend
      snapBack,           // Animate back to 0
      viewportHeight,     // Cached, no layout thrashing
    } = useSwipeAnimation({ trackRef, transitionDuration, easing: SPRING_EASING })

    // ==========================================================================
    // SYNC REFS
    // ==========================================================================

    useEffect(() => { videosRef.current = videos }, [videos])
    useEffect(() => { currentIndexRef.current = currentIndex }, [currentIndex])
    useEffect(() => { isLoadingRef.current = isLoading }, [isLoading])
    useEffect(() => { hasMoreRef.current = hasMore }, [hasMore])
    useEffect(() => { isLockedRef.current = isLocked }, [isLocked])

    // Clamp index when videos array changes
    useEffect(() => {
      if (videos.length === 0) {
        setCurrentIndex(0)
        return
      }
      if (currentIndex >= videos.length) {
        const newIndex = videos.length - 1
        const video = videos[newIndex]
        setCurrentIndex(newIndex)
        storeSetCurrentIndex(newIndex)
        if (video) {
          onVideoChange?.(video, newIndex)
        }
      }
    }, [videos.length, currentIndex, storeSetCurrentIndex, onVideoChange, videos])

    // Pre-loading priority calculation
    const getVideoPriority = useCallback((index: number) => {
      return getPreloadPriority(index, currentIndex)
    }, [currentIndex])

    // ==========================================================================
    // HELPERS
    // ==========================================================================

    const checkLoadMore = useCallback((index: number) => {
      const vids = videosRef.current
      if (
        hasMoreRef.current &&
        !isLoadingRef.current &&
        vids.length - index <= loadMoreThreshold
      ) {
        onLoadMore?.()
      }
    }, [loadMoreThreshold, onLoadMore])

    // ==========================================================================
    // NAVIGATION (Programmatic)
    // ==========================================================================

    const slideTo = useCallback(async (index: number, animated = true) => {
      if (isLockedRef.current) return

      const vids = videosRef.current
      const clampedIndex = Math.max(0, Math.min(index, vids.length - 1))
      const currentIdx = currentIndexRef.current

      if (clampedIndex === currentIdx) {
        // Reset position if same index
        setTranslateY(0)
        return
      }

      const direction = clampedIndex > currentIdx ? -1 : 1

      if (animated) {
        setIsLocked(true)
        setIsAnimating(true)

        // Animate to target position (Promise-based with transitionend)
        await animateTo(direction * viewportHeight)

        // Update state AFTER animation completes
        setCurrentIndex(clampedIndex)
        storeSetCurrentIndex(clampedIndex)

        // Reset position instantly
        setTranslateY(0)

        const video = vids[clampedIndex]
        if (video) {
          onVideoChange?.(video, clampedIndex)
        }
        checkLoadMore(clampedIndex)

        setIsAnimating(false)
        setIsLocked(false)
      } else {
        // Instant navigation
        setCurrentIndex(clampedIndex)
        storeSetCurrentIndex(clampedIndex)
        setTranslateY(0)

        const video = vids[clampedIndex]
        if (video) {
          onVideoChange?.(video, clampedIndex)
          checkLoadMore(clampedIndex)
        }
      }
    }, [viewportHeight, animateTo, setTranslateY, storeSetCurrentIndex, onVideoChange, checkLoadMore])

    const slideNext = useCallback((animated = true) => {
      const vids = videosRef.current
      const idx = currentIndexRef.current
      if (idx < vids.length - 1) {
        slideTo(idx + 1, animated)
      }
    }, [slideTo])

    const slidePrev = useCallback((animated = true) => {
      const idx = currentIndexRef.current
      if (idx > 0) {
        slideTo(idx - 1, animated)
      }
    }, [slideTo])

    // ==========================================================================
    // GESTURE HANDLERS (High-performance, no React re-renders in hot path)
    // ==========================================================================

    /**
     * Handle swipe progress for visual feedback
     * This is the HOT PATH - called 60-120 times/second during swipe
     * Uses direct DOM manipulation via useSwipeAnimation
     */
    const handleSwipeProgress = useCallback(
      (_progress: number, direction: 'up' | 'down', movement: number) => {
        const vids = videosRef.current
        const idx = currentIndexRef.current
        const canGoUp = idx > 0
        const canGoDown = idx < vids.length - 1

        // Use raw movement for 1:1 finger tracking
        let delta = movement

        // Apply rubber band effect at boundaries
        const atBoundary = (direction === 'down' && !canGoUp) || (direction === 'up' && !canGoDown)
        if (atBoundary) {
          delta *= 0.3 // Resistance at boundaries
        }

        // Direct DOM update - no React re-render!
        setTranslateY(delta)
      },
      [setTranslateY]
    )

    /**
     * Handle swipe up (next video)
     * Uses async/await with transitionend for accurate timing
     */
    const handleSwipeUp = useCallback(async () => {
      const vids = videosRef.current
      const idx = currentIndexRef.current
      const canGoDown = idx < vids.length - 1

      if (!canGoDown) {
        // Snap back - at the end
        await snapBack()
        return
      }

      // Lock to prevent rapid swipes
      setIsLocked(true)
      setIsAnimating(true)

      // Animate to next position (uses transitionend, not setTimeout)
      await animateTo(-viewportHeight)

      // Update state AFTER animation completes
      const newIndex = currentIndexRef.current + 1
      const newVids = videosRef.current

      if (newIndex < newVids.length) {
        setCurrentIndex(newIndex)
        storeSetCurrentIndex(newIndex)

        const video = newVids[newIndex]
        if (video) {
          onVideoChange?.(video, newIndex)
        }
        checkLoadMore(newIndex)
      }

      // Reset position instantly (no transition)
      setTranslateY(0)

      setIsAnimating(false)
      setIsLocked(false)
    }, [viewportHeight, animateTo, snapBack, setTranslateY, storeSetCurrentIndex, onVideoChange, checkLoadMore])

    /**
     * Handle swipe down (previous video)
     */
    const handleSwipeDown = useCallback(async () => {
      const idx = currentIndexRef.current
      const canGoUp = idx > 0

      if (!canGoUp) {
        // Snap back - at the beginning
        await snapBack()
        return
      }

      // Lock to prevent rapid swipes
      setIsLocked(true)
      setIsAnimating(true)

      // Animate to prev position
      await animateTo(viewportHeight)

      // Update state AFTER animation completes
      const newIndex = currentIndexRef.current - 1

      if (newIndex >= 0) {
        setCurrentIndex(newIndex)
        storeSetCurrentIndex(newIndex)

        const video = videosRef.current[newIndex]
        if (video) {
          onVideoChange?.(video, newIndex)
        }
      }

      // Reset position instantly
      setTranslateY(0)

      setIsAnimating(false)
      setIsLocked(false)
    }, [viewportHeight, animateTo, snapBack, setTranslateY, storeSetCurrentIndex, onVideoChange])

    /**
     * Handle swipe cancel (snap back)
     */
    const handleSwipeCancel = useCallback(async () => {
      await snapBack()
    }, [snapBack])

    // ==========================================================================
    // GESTURE BINDING
    // ==========================================================================

    // Use vertical swipe gesture from @xhub-reel/gestures
    const { bind: swipeBind } = useVerticalSwipe({
      onSwipeUp: handleSwipeUp,
      onSwipeDown: handleSwipeDown,
      onSwipeProgress: handleSwipeProgress,
      onSwipeCancel: handleSwipeCancel,
      threshold: swipeThreshold / viewportHeight, // Convert px to percentage
      velocityThreshold,
      hapticEnabled,
      disabled: gesturesDisabled || isLocked,
      enableProgressState: false, // Disable for maximum performance
    })

    // ==========================================================================
    // IMPERATIVE HANDLE
    // ==========================================================================

    useImperativeHandle(ref, () => ({
      slideTo,
      slideNext,
      slidePrev,
      get activeIndex() { return currentIndexRef.current },
      get totalSlides() { return videosRef.current.length },
      get isBeginning() { return currentIndexRef.current === 0 },
      get isEnd() { return currentIndexRef.current === videosRef.current.length - 1 },
    }))

    // Initial callback
    useEffect(() => {
      const video = videos[currentIndex]
      if (video) {
        onVideoChange?.(video, currentIndex)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // ==========================================================================
    // RENDER
    // ==========================================================================

    // Build slides array: only prev, current, next
    const slides: Array<{ index: number; position: number }> = []

    if (currentIndex > 0) {
      slides.push({ index: currentIndex - 1, position: -1 })
    }
    slides.push({ index: currentIndex, position: 0 })
    if (currentIndex < videos.length - 1) {
      slides.push({ index: currentIndex + 1, position: 1 })
    }

    // Empty state
    if (videos.length === 0) {
      return (
        <div
          ref={containerRef}
          style={mergeStyles(feedStyles.container, style)}
          className={className}
          data-xhub-reel-feed
        >
          {isLoading && (
            <div style={{ ...feedStyles.loadingIndicator, top: '50%', bottom: 'auto' }}>
              <div style={feedStyles.spinner} />
            </div>
          )}
        </div>
      )
    }

    // Track style - static! Animation handled via direct DOM
    const trackStyle: CSSProperties = {
      ...feedStyles.track,
      // transform and transition are now managed via trackRef.current.style
    }

    return (
      <div
        ref={containerRef}
        {...swipeBind()}
        style={mergeStyles(feedStyles.container, style)}
        className={className}
        data-xhub-reel-feed
      >
        {/* Keyframes */}
        <style>{`
          @keyframes xhub-reel-spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        {/* Track with slides */}
        <div ref={trackRef} style={trackStyle}>
          {slides.map(({ index, position }) => {
            const video = videos[index]
            if (!video) return null

            const priority = getVideoPriority(index)
            // isActive is false during animation to prevent video state issues
            const isActive = index === currentIndex && !isAnimating

            return (
              <div
                key={video.id}
                data-index={index}
                style={{
                  ...feedStyles.slide,
                  top: position * viewportHeight,
                }}
              >
                <VideoFeedItem
                  video={video}
                  isActive={isActive}
                  priority={priority}
                  onLike={() => onLike?.(video)}
                  onComment={() => onComment?.(video)}
                  onShare={() => onShare?.(video)}
                  onAuthorClick={() => onAuthorClick?.(video)}
                />
              </div>
            )
          })}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div style={feedStyles.loadingIndicator}>
            <div style={feedStyles.spinner} />
          </div>
        )}
      </div>
    )
  }
)

VideoFeed.displayName = 'VideoFeed'
