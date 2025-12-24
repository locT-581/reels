/**
 * Timeline - High-performance video progress bar
 *
 * Features:
 * - Uses requestAnimationFrame instead of state (zero re-renders)
 * - Throttled to 30 FPS for performance
 * - Two modes: collapsed (simple) and expanded (full controls)
 * - Touch-friendly scrubbing
 * - Buffer progress indicator
 * - Full accessibility support (ARIA)
 *
 * @remarks
 * This is the canonical seek bar component for VortexStream.
 * For video feeds, use this component instead of SeekBar from @vortex/ui.
 */

'use client'

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  type CSSProperties,
} from 'react'
import {
  colors,
  spacing,
  radii,
  fontSizes,
  fontWeights,
  shadows,
  zIndices,
  SEEK_BAR,
} from '@vortex/core'

// =============================================================================
// TYPES
// =============================================================================

export interface TimelineProps {
  /** Reference to the video element */
  videoRef: React.RefObject<HTMLVideoElement | null>
  /** Whether timeline is expanded */
  expanded?: boolean
  /** Called when user starts seeking */
  onSeekStart?: () => void
  /** Called during seeking with new time */
  onSeek?: (time: number) => void
  /** Called when user finishes seeking */
  onSeekEnd?: (time: number) => void
  /** Called when expanded state should toggle */
  onExpandedChange?: (expanded: boolean) => void
  /** Custom styles */
  style?: CSSProperties
  /** Custom className */
  className?: string
}

export interface TimelineRef {
  /** Force update the timeline */
  update: () => void
  /** Set expanded state */
  setExpanded: (expanded: boolean) => void
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Animation loop runs at 30 FPS for smooth updates without excessive CPU usage */
const TARGET_FPS = 30
const FRAME_INTERVAL = 1000 / TARGET_FPS // ~33.3ms

// =============================================================================
// STYLES
// =============================================================================

const styles = {
  container: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: zIndices.sticky, // Use design token instead of hardcoded value
    touchAction: 'none',
    userSelect: 'none' as const,
    WebkitUserSelect: 'none' as const,
    // add animation for the container
    transition: 'all 0.125s ease-in-out',
  } satisfies CSSProperties,

  // Collapsed mode - thin bar at bottom
  collapsed: {
    height: SEEK_BAR.HEIGHT_DEFAULT,
    paddingInline: spacing[3],
    cursor: 'pointer',
  } satisfies CSSProperties,

  // Expanded mode - full controls with gradient background
  expanded: {
    padding: `${spacing[2]}px ${spacing[3]}px`,
    paddingBottom: `calc(${spacing[1]}px + env(safe-area-inset-bottom, 0px))`,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
  } satisfies CSSProperties,

  // Time display - centered single line "0:07 / 0:13"
  timeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[2],
  } satisfies CSSProperties,

  timeText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.text,
    textShadow: shadows.text,
    fontVariantNumeric: 'tabular-nums',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: `${spacing[1]}px ${spacing[3]}px`,
    borderRadius: radii.md,
  } satisfies CSSProperties,

  // Track
  track: {
    position: 'relative' as const,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: radii.full,
    overflow: 'hidden',
  } satisfies CSSProperties,

  trackCollapsed: {
    height: SEEK_BAR.HEIGHT_DEFAULT,
  } satisfies CSSProperties,

  trackExpanded: {
    height: SEEK_BAR.HEIGHT_ACTIVE,
  } satisfies CSSProperties,

  // Buffer progress
  buffer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: radii.full,
  } satisfies CSSProperties,

  // Play progress
  progress: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: colors.text,
    borderRadius: radii.full,
  } satisfies CSSProperties,

  // Scrubber handle (expanded only)
  scrubber: {
    position: 'absolute' as const,
    top: '50%',
    width: 16,
    height: 16,
    marginLeft: -8,
    marginTop: -8,
    backgroundColor: colors.text,
    borderRadius: radii.full,
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    transform: 'scale(0)',
    transition: 'transform 150ms ease',
  } satisfies CSSProperties,

  scrubberVisible: {
    transform: 'scale(1)',
  } satisfies CSSProperties,

  // Hover/touch area (larger than visual track)
  touchArea: {
    position: 'absolute' as const,
    top: -12,
    left: 0,
    right: 0,
    bottom: -12,
    cursor: 'pointer',
  } satisfies CSSProperties,
}

// =============================================================================
// HELPERS
// =============================================================================

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds)) return '0:00'

  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function getBufferedEnd(video: HTMLVideoElement): number {
  if (video.buffered.length === 0) return 0

  // Find the buffered range that contains current time
  for (let i = 0; i < video.buffered.length; i++) {
    if (video.buffered.start(i) <= video.currentTime && video.buffered.end(i) >= video.currentTime) {
      return video.buffered.end(i)
    }
  }

  // Fallback to last buffered end
  return video.buffered.end(video.buffered.length - 1)
}

// =============================================================================
// COMPONENT
// =============================================================================

export const Timeline = forwardRef<TimelineRef, TimelineProps>(
  (
    {
      videoRef,
      expanded = false,
      onSeekStart,
      onSeek,
      onSeekEnd,
      onExpandedChange,
      style,
      className = '',
    },
    ref
  ) => {
    // Refs for DOM elements (direct manipulation, no state)
    const containerRef = useRef<HTMLDivElement>(null)
    const progressRef = useRef<HTMLDivElement>(null)
    const bufferRef = useRef<HTMLDivElement>(null)
    const scrubberRef = useRef<HTMLDivElement>(null)
    const timeDisplayRef = useRef<HTMLSpanElement>(null)
    const durationCacheRef = useRef<number>(0)

    // ARIA state (lightweight state for accessibility, updated less frequently)
    const [ariaValues, setAriaValues] = useState({ currentTime: 0, duration: 0 })

    // Animation state refs
    const animationFrameRef = useRef<number | null>(null)
    const lastUpdateRef = useRef<number>(0)
    const lastAriaUpdateRef = useRef<number>(0)
    const isSeekingRef = useRef(false)
    const expandedRef = useRef(expanded)

    // Keep expanded ref in sync
    useEffect(() => {
      expandedRef.current = expanded
    }, [expanded])

    // Update DOM directly (no state, no re-render)
    const updateTimeline = useCallback((timestamp?: number) => {
      const video = videoRef.current
      if (!video || isSeekingRef.current) return

      const duration = video.duration || 0
      const currentTime = video.currentTime || 0
      const bufferedEnd = getBufferedEnd(video)

      const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0
      const bufferPercent = duration > 0 ? (bufferedEnd / duration) * 100 : 0

      // Update progress bar
      if (progressRef.current) {
        progressRef.current.style.width = `${progressPercent}%`
      }

      // Update buffer bar
      if (bufferRef.current) {
        bufferRef.current.style.width = `${bufferPercent}%`
      }

      // Update scrubber position (expanded mode)
      if (scrubberRef.current && expandedRef.current) {
        scrubberRef.current.style.left = `${progressPercent}%`
      }

      // Cache duration for time display
      durationCacheRef.current = duration

      // Update time display - format: "0:07 / 0:13"
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`
      }

      // Update ARIA values less frequently (every 500ms) to avoid excessive re-renders
      const now = timestamp ?? performance.now()
      if (now - lastAriaUpdateRef.current >= 500) {
        lastAriaUpdateRef.current = now
        setAriaValues((prev) => {
          // Only update if values changed significantly (avoid unnecessary re-renders)
          if (Math.abs(prev.currentTime - currentTime) >= 0.5 || prev.duration !== duration) {
            return { currentTime: Math.floor(currentTime), duration: Math.floor(duration) }
          }
          return prev
        })
      }
    }, [videoRef])

    // Animation loop at 30 FPS
    const animationLoop = useCallback((timestamp: number) => {
      // Throttle to target FPS
      if (timestamp - lastUpdateRef.current >= FRAME_INTERVAL) {
        lastUpdateRef.current = timestamp
        updateTimeline()
      }

      animationFrameRef.current = requestAnimationFrame(animationLoop)
    }, [updateTimeline])

    // Start/stop animation loop
    useEffect(() => {
      animationFrameRef.current = requestAnimationFrame(animationLoop)

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }, [animationLoop])

    // Calculate time from position
    const getTimeFromPosition = useCallback((clientX: number): number => {
      const container = containerRef.current
      const video = videoRef.current
      if (!container || !video) return 0

      const rect = container.getBoundingClientRect()
      const x = clientX - rect.left
      const percent = Math.max(0, Math.min(1, x / rect.width))
      return percent * (video.duration || 0)
    }, [videoRef])

    // Handle seek
    const handleSeekStart = useCallback((clientX: number) => {
      isSeekingRef.current = true
      onSeekStart?.()

      const time = getTimeFromPosition(clientX)
      onSeek?.(time)

      // Update visual immediately
      const video = videoRef.current
      if (video && progressRef.current) {
        const duration = video.duration || durationCacheRef.current || 1
        const percent = (time / duration) * 100
        progressRef.current.style.width = `${percent}%`
        if (scrubberRef.current) {
          scrubberRef.current.style.left = `${percent}%`
        }
        if (timeDisplayRef.current) {
          timeDisplayRef.current.textContent = `${formatTime(time)} / ${formatTime(duration)}`
        }
      }
    }, [getTimeFromPosition, onSeek, onSeekStart, videoRef])

    const handleSeekMove = useCallback((clientX: number) => {
      if (!isSeekingRef.current) return

      const time = getTimeFromPosition(clientX)
      onSeek?.(time)

      // Update visual immediately
      const video = videoRef.current
      if (video && progressRef.current) {
        const duration = video.duration || durationCacheRef.current || 1
        const percent = (time / duration) * 100
        progressRef.current.style.width = `${percent}%`
        if (scrubberRef.current) {
          scrubberRef.current.style.left = `${percent}%`
        }
        if (timeDisplayRef.current) {
          timeDisplayRef.current.textContent = `${formatTime(time)} / ${formatTime(duration)}`
        }
      }
    }, [getTimeFromPosition, onSeek, videoRef])

    const handleSeekEnd = useCallback((clientX: number) => {
      if (!isSeekingRef.current) return

      isSeekingRef.current = false
      const time = getTimeFromPosition(clientX)
      onSeekEnd?.(time)

      // Apply seek to video
      const video = videoRef.current
      if (video) {
        video.currentTime = time
      }
    }, [getTimeFromPosition, onSeekEnd, videoRef])

    // Touch handlers
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      handleSeekStart(touch.clientX)
    }, [handleSeekStart])

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return
      handleSeekMove(touch.clientX)
    }, [handleSeekMove])

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
      const touch = e.changedTouches[0]
      if (!touch) return
      handleSeekEnd(touch.clientX)
    }, [handleSeekEnd])

    // Mouse handlers
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      handleSeekStart(e.clientX)

      const handleMouseMove = (e: MouseEvent) => handleSeekMove(e.clientX)
      const handleMouseUp = (e: MouseEvent) => {
        handleSeekEnd(e.clientX)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }, [handleSeekStart, handleSeekMove, handleSeekEnd])

    // Click to expand (collapsed mode)
    const handleClick = useCallback(() => {
      if (!expanded) {
        onExpandedChange?.(true)
      }
    }, [expanded, onExpandedChange])

    // Keyboard navigation for accessibility
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      const video = videoRef.current
      if (!video) return

      const duration = video.duration || 0
      const currentTime = video.currentTime || 0
      let newTime = currentTime

      switch (e.key) {
        case 'ArrowLeft':
          newTime = Math.max(0, currentTime - 5)
          break
        case 'ArrowRight':
          newTime = Math.min(duration, currentTime + 5)
          break
        case 'ArrowUp':
          newTime = Math.min(duration, currentTime + 10)
          break
        case 'ArrowDown':
          newTime = Math.max(0, currentTime - 10)
          break
        case 'Home':
          newTime = 0
          break
        case 'End':
          newTime = duration
          break
        default:
          return
      }

      e.preventDefault()
      video.currentTime = newTime
      onSeek?.(newTime)
      updateTimeline()
    }, [videoRef, onSeek, updateTimeline])

    // Imperative handle
    useImperativeHandle(ref, () => ({
      update: updateTimeline,
      setExpanded: (value: boolean) => {
        onExpandedChange?.(value)
      },
    }))

    // Container styles
    const containerStyles: CSSProperties = {
      ...styles.container,
      ...(expanded ? styles.expanded : styles.collapsed),
      ...style,
    }

    // Track styles
    const trackStyles: CSSProperties = {
      ...styles.track,
      ...(expanded ? styles.trackExpanded : styles.trackCollapsed),
    }

    // Scrubber styles
    const scrubberStyles: CSSProperties = {
      ...styles.scrubber,
      ...(expanded ? styles.scrubberVisible : {}),
    }

    return (
      <div
        ref={containerRef}
        style={containerStyles}
        className={className}
        onClick={!expanded ? handleClick : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        // Accessibility attributes
        role="slider"
        aria-label="Video progress"
        aria-valuemin={0}
        aria-valuemax={ariaValues.duration}
        aria-valuenow={ariaValues.currentTime}
        aria-valuetext={`${formatTime(ariaValues.currentTime)} of ${formatTime(ariaValues.duration)}`}
        tabIndex={0}
      >
        {/* Time display - centered "0:07 / 0:13" (expanded only) */}
        {expanded && (
          <div style={styles.timeContainer}>
            <span ref={timeDisplayRef} style={styles.timeText}>0:00 / 0:00</span>
          </div>
        )}

        {/* Track */}
        <div style={trackStyles} aria-hidden="true">
          {/* Larger touch area */}
          <div style={styles.touchArea} />

          {/* Buffer progress */}
          <div ref={bufferRef} style={styles.buffer} />

          {/* Play progress */}
          <div ref={progressRef} style={styles.progress} />

          {/* Scrubber handle (expanded only) */}
          {expanded && <div ref={scrubberRef} style={scrubberStyles} />}
        </div>
      </div>
    )
  }
)

Timeline.displayName = 'Timeline'

