/**
 * XHubReelEmbed - Main embeddable component
 */

'use client'

import { useCallback, useRef } from 'react'
import type { Video } from '@xhub-reel/core'
import { VideoFeed, type VideoFeedRef } from '@xhub-reel/feed'

export interface XHubReelEmbedProps {
  /** Videos to display */
  videos: Video[]
  /** Initial video index */
  initialIndex?: number
  /** Callback when more videos should be loaded */
  onLoadMore?: () => void
  /** Whether there are more videos to load */
  hasMore?: boolean
  /** Loading state */
  isLoading?: boolean
  /** Callback when a video is liked */
  onLike?: (video: Video) => void
  /** Callback when comments should be shown */
  onComment?: (video: Video) => void
  /** Callback when share sheet should be shown */
  onShare?: (video: Video) => void
  /** Callback when author profile should be shown */
  onAuthorClick?: (video: Video) => void
  /** Callback when the current video changes */
  onVideoChange?: (video: Video, index: number) => void
  /** Custom className */
  className?: string
}

export function XHubReelEmbed({
  videos,
  initialIndex = 0,
  onLoadMore,
  hasMore = true,
  isLoading = false,
  onLike,
  onComment,
  onShare,
  onAuthorClick,
  onVideoChange,
  className = '',
}: XHubReelEmbedProps) {
  const feedRef = useRef<VideoFeedRef>(null)

  // Handle video change
  const handleVideoChange = useCallback(
    (video: Video, index: number) => {
      onVideoChange?.(video, index)
    },
    [onVideoChange]
  )

  // Handle like
  const handleLike = useCallback(
    (video: Video) => {
      onLike?.(video)
    },
    [onLike]
  )

  // Handle comment
  const handleComment = useCallback(
    (video: Video) => {
      onComment?.(video)
    },
    [onComment]
  )

  // Handle share
  const handleShare = useCallback(
    (video: Video) => {
      onShare?.(video)
    },
    [onShare]
  )

  // Handle author click
  const handleAuthorClick = useCallback(
    (video: Video) => {
      onAuthorClick?.(video)
    },
    [onAuthorClick]
  )

  return (
    <div
      className={`h-screen w-full overflow-hidden bg-black ${className}`}
    >
      <VideoFeed
        ref={feedRef}
        videos={videos}
        initialIndex={initialIndex}
        onLoadMore={onLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        onVideoChange={handleVideoChange}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
        onAuthorClick={handleAuthorClick}
      />
    </div>
  )
}
