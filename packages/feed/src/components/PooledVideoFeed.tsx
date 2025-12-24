/**
 * PooledVideoFeed - High-performance video feed with engine pooling
 *
 * This component wraps VideoFeed with VideoEnginePool for instant video playback.
 * It pre-loads and pre-decodes adjacent videos to eliminate black screens
 * when swiping between videos.
 *
 * @example
 * ```tsx
 * import { PooledVideoFeed } from '@xhub-reel/feed'
 *
 * function App() {
 *   return (
 *     <PooledVideoFeed
 *       videos={videos}
 *       onVideoChange={handleVideoChange}
 *       onLike={handleLike}
 *     />
 *   )
 * }
 * ```
 *
 * For more control, use the provider directly:
 * ```tsx
 * import { VideoEnginePoolProvider, VideoFeed, usePoolOrchestration } from '@xhub-reel/feed'
 *
 * function CustomFeed() {
 *   const [currentIndex, setCurrentIndex] = useState(0)
 *
 *   // Enable pool orchestration
 *   usePoolOrchestration(currentIndex, videos)
 *
 *   return <VideoFeed videos={videos} ... />
 * }
 *
 * <VideoEnginePoolProvider>
 *   <CustomFeed />
 * </VideoEnginePoolProvider>
 * ```
 */

'use client'

import {
  forwardRef,
  useState,
  useCallback,
} from 'react'
import type { Video } from '@xhub-reel/core'
import {
  VideoEnginePoolProvider,
  usePoolOrchestration,
  type VideoEnginePoolProviderProps,
} from '../hooks/useVideoEnginePool'
import { VideoFeed, type VideoFeedProps, type VideoFeedRef } from './VideoFeed'
import type { PreloadPriority } from '../hooks/usePreloader'

// =============================================================================
// TYPES
// =============================================================================

export interface PooledVideoFeedProps extends Omit<VideoFeedProps, 'children'> {
  /** Pool configuration */
  poolConfig?: VideoEnginePoolProviderProps['config']
  /** Force HLS.js over native (recommended for WebViews) */
  forceHLSJS?: boolean
  /** Show timeline control */
  showTimeline?: boolean
  /** Custom render function for video items */
  renderVideoItem?: (props: {
    video: Video
    isActive: boolean
    priority: PreloadPriority
  }) => React.ReactNode
}

// =============================================================================
// INNER COMPONENT (with pool orchestration)
// =============================================================================

interface PooledVideoFeedInnerProps extends VideoFeedProps {
  videos: Video[]
  showTimeline: boolean
  renderVideoItem?: PooledVideoFeedProps['renderVideoItem']
  onVideoChangeInternal: (video: Video, index: number) => void
}

const PooledVideoFeedInner = forwardRef<VideoFeedRef, PooledVideoFeedInnerProps>(
  (
    {
      videos,
      showTimeline,
      renderVideoItem,
      onVideoChangeInternal,
      onVideoChange,
      ...feedProps
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(feedProps.initialIndex ?? 0)

    // Enable pool orchestration - this preloads adjacent videos
    usePoolOrchestration(currentIndex, videos)

    // Handle video change
    const handleVideoChange = useCallback(
      (video: Video, index: number) => {
        setCurrentIndex(index)
        onVideoChangeInternal(video, index)
        onVideoChange?.(video, index)
      },
      [onVideoChangeInternal, onVideoChange]
    )

    // Note: Custom render (renderVideoItem) is available but VideoFeed
    // doesn't support custom render prop yet. Pool orchestration still works
    // because usePoolOrchestration handles the preloading/activation.
    // TODO: Add renderItem prop to VideoFeed for full customization
    void renderVideoItem
    void showTimeline

    return (
      <VideoFeed
        ref={ref}
        videos={videos}
        {...feedProps}
        onVideoChange={handleVideoChange}
      />
    )
  }
)

PooledVideoFeedInner.displayName = 'PooledVideoFeedInner'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * PooledVideoFeed - VideoFeed with automatic engine pooling
 *
 * This component wraps VideoFeed with VideoEnginePoolProvider for
 * high-performance video preloading and instant playback.
 */
export const PooledVideoFeed = forwardRef<VideoFeedRef, PooledVideoFeedProps>(
  (
    {
      poolConfig,
      forceHLSJS,
      showTimeline = true,
      renderVideoItem,
      onVideoChange,
      ...feedProps
    },
    ref
  ) => {
    // Track current video for debugging
    const handleVideoChangeInternal = useCallback(
      (video: Video, index: number) => {
        console.log('[PooledVideoFeed] Video changed', { videoId: video.id, index })
      },
      []
    )

    return (
      <VideoEnginePoolProvider
        config={poolConfig}
        forceHLSJS={forceHLSJS}
        onFirstFrameReady={(slot) => {
          console.log('[PooledVideoFeed] First frame ready', slot.videoId)
        }}
        onError={(slot, error) => {
          console.warn('[PooledVideoFeed] Slot error', slot.videoId, error)
        }}
      >
        <PooledVideoFeedInner
          ref={ref}
          showTimeline={showTimeline}
          renderVideoItem={renderVideoItem}
          onVideoChange={onVideoChange}
          onVideoChangeInternal={handleVideoChangeInternal}
          {...feedProps}
        />
      </VideoEnginePoolProvider>
    )
  }
)

PooledVideoFeed.displayName = 'PooledVideoFeed'

// =============================================================================
// NOTE: For API-connected feeds with pooling, use:
// <ConnectedVideoFeed pooling={true} />
// =============================================================================
