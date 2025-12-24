/**
 * ConnectedVideoFeed - High-performance VideoFeed with automatic API data fetching
 *
 * Features:
 * - Automatic data fetching from your backend
 * - Optional Video Engine Pool for instant playback (enabled by default)
 * - Pre-loading and pre-decoding adjacent videos for seamless swipe experience
 *
 * Requires XHubReelProvider config to be set up, or pass config directly.
 *
 * @example
 * ```tsx
 * // Basic usage (pooling enabled by default)
 * <XHubReelProvider config={{ baseUrl: 'https://api.example.com' }}>
 *   <ConnectedVideoFeed onLike={handleLike} />
 * </XHubReelProvider>
 *
 * // Disable pooling for simpler use cases
 * <ConnectedVideoFeed pooling={false} />
 *
 * // Custom pool configuration
 * <ConnectedVideoFeed
 *   config={{ baseUrl: 'https://api.example.com', auth: { accessToken: '...' } }}
 *   poolConfig={{ poolSize: 5 }}
 *   forceHLSJS  // Recommended for WebViews
 * />
 * ```
 */

'use client'

import { forwardRef, useCallback, useState } from 'react'
import type { Video, XHubReelConfig } from '@xhub-reel/core'
import { useXHubReelConfig } from '@xhub-reel/core/api'
import {
  FeedLoadingState,
  FeedErrorState,
  FeedEmptyState,
  FeedNoConfigState,
} from '@xhub-reel/ui'
import { VideoFeed, type VideoFeedRef, type VideoFeedProps } from './VideoFeed'
import { useVideoFeed } from '../hooks/useVideoFeed'
import {
  VideoEnginePoolProvider,
  usePoolOrchestration,
  type VideoEnginePoolProviderProps,
} from '../hooks/useVideoEnginePool'

// =============================================================================
// TYPES
// =============================================================================

export interface ConnectedVideoFeedProps
  extends Omit<VideoFeedProps, 'videos' | 'isLoading' | 'hasMore' | 'onLoadMore'> {
  /**
   * XHubReelConfig for API connection
   * Optional if wrapped in XHubReelProvider with config
   */
  config?: XHubReelConfig

  /**
   * User ID for user-specific feed
   */
  userId?: string

  /**
   * Tag/hashtag filter
   */
  tag?: string

  /**
   * Search query
   */
  searchQuery?: string

  /**
   * Number of videos per page
   * @default 10
   */
  pageSize?: number

  /**
   * Initial videos to show while loading (optional)
   */
  initialVideos?: Video[]

  /**
   * Whether video should start muted
   * Set to false if you have already handled browser autoplay policy
   * @default true
   */
  initialMuted?: boolean

  /**
   * Enable Video Engine Pool for instant playback
   * - When `true`: Uses pre-loading and pre-decoding for seamless swipe
   * - When `false`: Uses standard video loading (simpler, less memory)
   * @default true
   */
  pooling?: boolean

  /**
   * Pool configuration (only used when pooling=true)
   */
  poolConfig?: VideoEnginePoolProviderProps['config']

  /**
   * Force HLS.js over native HLS (only used when pooling=true)
   * Recommended for WebViews (especially iOS) for better preloading control
   * @default auto-detect based on platform
   */
  forceHLSJS?: boolean

  /**
   * Called when videos are successfully fetched
   */
  onFetchSuccess?: (videos: Video[]) => void

  /**
   * Called when fetch fails
   */
  onFetchError?: (error: Error) => void

  /**
   * Render custom loading state
   */
  renderLoading?: () => React.ReactNode

  /**
   * Render custom error state
   */
  renderError?: (error: Error, retry: () => void) => React.ReactNode

  /**
   * Render custom empty state
   */
  renderEmpty?: () => React.ReactNode
}

// =============================================================================
// INNER COMPONENT (with pool orchestration)
// =============================================================================

interface ConnectedVideoFeedInnerProps
  extends Omit<VideoFeedProps, 'isLoading' | 'hasMore' | 'onLoadMore'> {
  videos: Video[]
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => Promise<void>
  /** Enable pool orchestration */
  usePooling: boolean
}

const ConnectedVideoFeedInner = forwardRef<VideoFeedRef, ConnectedVideoFeedInnerProps>(
  (
    {
      videos,
      isLoading,
      hasMore,
      onLoadMore,
      onVideoChange,
      initialIndex = 0,
      usePooling,
      ...feedProps
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)

    // Enable pool orchestration when pooling is active
    // This preloads adjacent videos for instant playback
    usePoolOrchestration(usePooling ? currentIndex : -1, usePooling ? videos : [])

    // Handle video change
    const handleVideoChange = useCallback(
      (video: Video, index: number) => {
        setCurrentIndex(index)
        onVideoChange?.(video, index)
      },
      [onVideoChange]
    )

    return (
      <VideoFeed
        ref={ref}
        videos={videos}
        isLoading={isLoading}
        hasMore={hasMore}
        onLoadMore={onLoadMore}
        onVideoChange={handleVideoChange}
        initialIndex={initialIndex}
        {...feedProps}
      />
    )
  }
)

ConnectedVideoFeedInner.displayName = 'ConnectedVideoFeedInner'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ConnectedVideoFeed = forwardRef<VideoFeedRef, ConnectedVideoFeedProps>(
  (
    {
      config: configProp,
      userId,
      tag,
      searchQuery,
      pageSize = 10,
      initialVideos,
      initialMuted = true,
      pooling = true,
      poolConfig,
      forceHLSJS,
      onFetchSuccess,
      onFetchError,
      renderLoading,
      renderError,
      renderEmpty,
      // Pass through VideoFeed props
      onVideoChange,
      onLike,
      onComment,
      onShare,
      onAuthorClick,
      ...videoFeedProps
    },
    ref
  ) => {
    // Get config from props or XHubReelProvider context
    const { config: contextConfig } = useXHubReelConfig()
    const config = configProp || contextConfig

    // Fetch videos using the hook
    const {
      videos,
      isLoading,
      isFetchingMore,
      hasMore,
      fetchNextPage,
      refetch,
      error,
    } = useVideoFeed({
      config: config || undefined,
      userId,
      tag,
      searchQuery,
      limit: pageSize,
      initialVideos,
      onSuccess: onFetchSuccess,
      onError: onFetchError,
    })

    // Handle load more
    const handleLoadMore = useCallback(async () => {
      await fetchNextPage()
    }, [fetchNextPage])

    // Handle retry
    const handleRetry = useCallback(() => {
      refetch()
    }, [refetch])

    // =========================================================================
    // STATE RENDERING
    // =========================================================================

    // No config provided
    if (!config) {
      return <FeedNoConfigState />
    }

    // Loading state
    if (isLoading && videos.length === 0) {
      return renderLoading ? renderLoading() : <FeedLoadingState />
    }

    // Error state
    if (error && videos.length === 0) {
      return renderError ? (
        renderError(error, handleRetry)
      ) : (
        <FeedErrorState error={error} onRetry={handleRetry} />
      )
    }

    // Empty state
    if (!isLoading && videos.length === 0) {
      return renderEmpty ? renderEmpty() : <FeedEmptyState />
    }

    // =========================================================================
    // FEED RENDERING
    // =========================================================================

    const feedContent = (
      <ConnectedVideoFeedInner
        ref={ref}
        videos={videos}
        isLoading={isFetchingMore}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        onVideoChange={onVideoChange}
        onLike={onLike}
        onComment={onComment}
        onShare={onShare}
        onAuthorClick={onAuthorClick}
        initialMuted={initialMuted}
        usePooling={pooling}
        {...videoFeedProps}
      />
    )

    // Wrap with VideoEnginePoolProvider when pooling is enabled
    if (pooling) {
      return (
        <VideoEnginePoolProvider
          config={poolConfig}
          forceHLSJS={forceHLSJS}
          onFirstFrameReady={(slot) => {
            console.log('[ConnectedVideoFeed] First frame ready:', slot.videoId)
          }}
          onError={(slot, err) => {
            console.warn('[ConnectedVideoFeed] Slot error:', slot.videoId, err)
          }}
        >
          {feedContent}
        </VideoEnginePoolProvider>
      )
    }

    // Without pooling - simpler rendering
    return feedContent
  }
)

ConnectedVideoFeed.displayName = 'ConnectedVideoFeed'
