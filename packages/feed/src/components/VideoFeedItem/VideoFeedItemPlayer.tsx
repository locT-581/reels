/**
 * VideoFeedItemPlayer - Video player component
 *
 * Renders the video element or placeholder based on context state.
 * Must be used within VideoFeedItem.
 *
 * Auto-detects VideoEnginePool context:
 * - If pool exists: Uses pre-buffered video element from pool (instant playback)
 * - If no pool: Creates native <video> element (original behavior)
 */

'use client'

import { forwardRef, useEffect, useRef, useState, useCallback, type HTMLAttributes } from 'react'
import { useVideoFeedItemContext } from './context'
import { useVideoEnginePoolOptional, useVideoEnginePoolReady } from '../../hooks/useVideoEnginePool'
import { videoFeedItemStyles } from '../styles'

export interface VideoFeedItemPlayerProps extends HTMLAttributes<HTMLDivElement> {
  /** Custom placeholder element */
  placeholder?: React.ReactNode
  /** Force using pool (if available) or native video */
  forceNative?: boolean
}

const VideoFeedItemPlayer = forwardRef<HTMLVideoElement, VideoFeedItemPlayerProps>(
  ({ placeholder, forceNative = false, ...props }, ref) => {
    const {
      video,
      videoRef,
      shouldRenderVideo,
      preload,
      isPreloaded,
      initialMuted,
      isActive,
      priority,
    } = useVideoFeedItemContext()

    // Pool integration
    const pool = useVideoEnginePoolOptional()
    const poolReady = useVideoEnginePoolReady()
    const containerRef = useRef<HTMLDivElement>(null)
    const attachedElementRef = useRef<HTMLVideoElement | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const prepareStartedRef = useRef(false)

    // Use pool if available and not forcing native
    const usePool = pool && poolReady && !forceNative

    // =========================================================================
    // HELPER: Attach element to container
    // =========================================================================

    const attachElement = useCallback((element: HTMLVideoElement, isReady: boolean) => {
      if (!containerRef.current) return false

      // Remove previous attached element if any
      if (attachedElementRef.current && attachedElementRef.current.parentNode) {
        attachedElementRef.current.parentNode.removeChild(attachedElementRef.current)
      }

      // Style the element for full coverage
      // IMPORTANT: Start with opacity 0 to prevent black flash, show when ready
      Object.assign(element.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        zIndex: '1',
        opacity: isReady ? '1' : '0',
        transition: 'opacity 0.15s ease-out',
      })

      // Listen for first frame to show video
      const handleCanPlay = () => {
        element.style.opacity = '1'
        setIsLoading(false)
      }

      // Check if already can play
      if (element.readyState >= 3) { // HAVE_FUTURE_DATA
        handleCanPlay()
      } else {
        element.addEventListener('canplay', handleCanPlay, { once: true })
      }

      // Attach to container
      containerRef.current.appendChild(element)
      attachedElementRef.current = element

      // Update refs for external access
      if (typeof ref === 'function') {
        ref(element)
      } else if (ref) {
        ref.current = element
      }
      ;(videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = element

      return true
    }, [ref, videoRef])

    // =========================================================================
    // POOL-BASED VIDEO MANAGEMENT
    // =========================================================================

    useEffect(() => {
      if (!usePool || !pool || !shouldRenderVideo) {
        setIsLoading(false)
        prepareStartedRef.current = false
        return
      }

      const videoId = video.id
      const videoUrl = video.url

      // STEP 1: Immediately try to get existing element (might already be prepared)
      const existingElement = pool.getElement(videoId)
      if (existingElement) {
        // Check if already ready
        const isReady = pool.isReady(videoId)
        const attached = attachElement(existingElement, isReady)
        if (attached) {
          if (!isReady) {
            setIsLoading(true)
            // Element exists but not ready - wait for it
            pool.prepare(videoId, videoUrl, { priority: 'high' })
              .catch(() => {
                // Error handled by canplay event or timeout
              })
          }

          console.log('[VideoFeedItemPlayer] Attached existing element:', videoId, { isReady })
          return
        }
      }

      // STEP 2: No existing element - need to prepare
      if (prepareStartedRef.current) return // Avoid duplicate preparation
      prepareStartedRef.current = true
      setIsLoading(true)

      const poolPriority = isActive ? 'high' : priority === 'high' ? 'high' : 'medium'

      // Start preparation
      pool.prepare(videoId, videoUrl, { priority: poolPriority })
        .then(() => {
          const element = pool.getElement(videoId)
          if (element) {
            attachElement(element, true) // Element is ready after prepare completes
            console.log('[VideoFeedItemPlayer] Prepared and attached:', videoId)
          }
        })
        .catch((err) => {
          console.warn('[VideoFeedItemPlayer] Prepare failed:', videoId, err)
          setIsLoading(false)
        })

      // Cleanup: remove element from container but don't dispose from pool
      return () => {
        if (attachedElementRef.current && attachedElementRef.current.parentNode === containerRef.current) {
          containerRef.current?.removeChild(attachedElementRef.current)
        }
        attachedElementRef.current = null
        prepareStartedRef.current = false
      }
    }, [usePool, pool, video.id, video.url, shouldRenderVideo, isActive, priority, attachElement])

    // =========================================================================
    // HANDLE ACTIVATION/DEACTIVATION
    // =========================================================================

    useEffect(() => {
      if (!usePool || !pool) return

      const videoId = video.id

      if (isActive) {
        // Activate: ensure prepared and playing
        pool.activate(videoId)
      } else {
        // Deactivate: pause but keep ready
        pool.deactivate(videoId)
      }
    }, [usePool, pool, video.id, isActive])

    // =========================================================================
    // RENDER
    // =========================================================================

    // Not ready to render video - show placeholder
    if (!shouldRenderVideo) {
      return (
        placeholder ?? (
          <div
            {...props}
            style={{
              ...videoFeedItemStyles.placeholder,
              backgroundImage: `url(${video.thumbnail})`,
              ...props.style,
            }}
          />
        )
      )
    }

    // Pool mode: render container for DOM-attached element
    if (usePool) {
      return (
        <div
          ref={containerRef}
          style={{
            ...videoFeedItemStyles.video,
            position: 'relative',
          }}
          {...props}
        >
          {/* Keyframes for spinner */}
          <style>{`
            @keyframes xhub-reel-spin {
              to { transform: rotate(360deg); }
            }
          `}</style>

          {/* Thumbnail fallback - always show under video to prevent black flash */}
          <div
            style={{
              ...videoFeedItemStyles.placeholder,
              backgroundImage: `url(${video.thumbnail})`,
              position: 'absolute',
              inset: 0,
              zIndex: 0,
            }}
          />

          {/* Loading indicator */}
          {isLoading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderWidth: 3,
                  borderStyle: 'solid',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderTopColor: '#8B5CF6',
                  borderRadius: '50%',
                  animation: 'xhub-reel-spin 0.8s linear infinite',
                }}
              />
            </div>
          )}
        </div>
      )
    }

    // Native mode: render video element directly (original behavior)
    const showPoster = !isPreloaded

    return (
      <video
        ref={(node) => {
          // Handle both forwarded ref and internal ref
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
          ;(videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = node
        }}
        src={video.url}
        poster={showPoster ? video.thumbnail : undefined}
        preload={preload}
        loop
        playsInline
        muted={initialMuted}
        style={videoFeedItemStyles.video}
      />
    )
  }
)

VideoFeedItemPlayer.displayName = 'VideoFeedItemPlayer'

export { VideoFeedItemPlayer }
