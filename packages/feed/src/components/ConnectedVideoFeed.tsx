/**
 * ConnectedVideoFeed - VideoFeed with automatic API data fetching
 *
 * This component wraps VideoFeed and handles data fetching from your backend.
 * Requires XHubReelProvider config to be set up, or pass config directly.
 *
 * @example
 * ```tsx
 * // With XHubReelProvider (recommended)
 * <XHubReelProvider config={{ baseUrl: 'https://api.example.com' }}>
 *   <ConnectedVideoFeed onLike={handleLike} />
 * </XHubReelProvider>
 *
 * // Or pass config directly
 * <ConnectedVideoFeed
 *   config={{ baseUrl: 'https://api.example.com', auth: { accessToken: '...' } }}
 * />
 * ```
 */

'use client'

import {
  forwardRef,
  useCallback,
  type CSSProperties,
} from 'react'
import type { Video, XHubReelConfig } from '@xhub-reel/core'
import { colors, spacing, fontSizes, fontWeights, radii } from '@xhub-reel/core'
import { useXHubReelConfig } from '@xhub-reel/core/api'
import { VideoFeed, type VideoFeedRef, type VideoFeedProps } from './VideoFeed'
import { useVideoFeed } from '../hooks/useVideoFeed'

// =============================================================================
// TYPES
// =============================================================================

export interface ConnectedVideoFeedProps extends Omit<VideoFeedProps, 'videos' | 'isLoading' | 'hasMore' | 'onLoadMore'> {
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
// STYLES
// =============================================================================

const stateStyles = {
  container: {
    position: 'fixed' as const,
    inset: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    color: colors.text,
    gap: spacing[4],
  } satisfies CSSProperties,

  spinner: {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderTopColor: colors.accent,
    borderRadius: radii.full,
    animation: 'xhub-reel-spin 1s linear infinite',
  } satisfies CSSProperties,

  text: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    maxWidth: 280,
    lineHeight: 1.5,
  } satisfies CSSProperties,

  button: {
    padding: `${spacing[3]}px ${spacing[6]}px`,
    backgroundColor: colors.accent,
    color: colors.text,
    border: 'none',
    borderRadius: radii.md,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    cursor: 'pointer',
  } satisfies CSSProperties,

  errorIcon: {
    fontSize: 48,
    marginBottom: spacing[2],
  } satisfies CSSProperties,
}

// =============================================================================
// DEFAULT RENDERS
// =============================================================================

const DefaultLoading = () => (
  <div style={stateStyles.container}>
    <style>{`
      @keyframes xhub-reel-spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
    <div style={stateStyles.spinner} />
    <p style={stateStyles.text}>Đang tải video...</p>
  </div>
)

const DefaultError = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div style={stateStyles.container}>
    <div style={stateStyles.errorIcon}>😕</div>
    <p style={stateStyles.text}>
      {error.message || 'Có lỗi xảy ra khi tải video'}
    </p>
    <button style={stateStyles.button} onClick={retry}>
      Thử lại
    </button>
  </div>
)

const DefaultEmpty = () => (
  <div style={stateStyles.container}>
    <div style={stateStyles.errorIcon}>📭</div>
    <p style={stateStyles.text}>
      Không có video nào để hiển thị
    </p>
  </div>
)

// =============================================================================
// COMPONENT
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
      onFetchSuccess,
      onFetchError,
      renderLoading = () => <DefaultLoading />,
      renderError = (error, retry) => <DefaultError error={error} retry={retry} />,
      renderEmpty = () => <DefaultEmpty />,
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

    // No config provided
    if (!config) {
      return (
        <div style={stateStyles.container}>
          <div style={stateStyles.errorIcon}>⚠️</div>
          <p style={stateStyles.text}>
            Chưa cấu hình API. Vui lòng wrap component trong XHubReelProvider với config hoặc truyền config prop.
          </p>
        </div>
      )
    }

    // Loading state
    if (isLoading && videos.length === 0) {
      return renderLoading()
    }

    // Error state
    if (error && videos.length === 0) {
      return renderError(error, handleRetry)
    }

    // Empty state
    if (!isLoading && videos.length === 0) {
      return renderEmpty()
    }

    // Render feed
    return (
      <VideoFeed
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
        {...videoFeedProps}
      />
    )
  }
)

ConnectedVideoFeed.displayName = 'ConnectedVideoFeed'

