/**
 * VideoFeed - Main virtualized video feed component
 */

'use client'

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useFeedStore } from '@vortex/core'
import type { Video } from '@vortex/core'
import { VideoFeedItem } from './VideoFeedItem'
import { usePreloader } from '../hooks/usePreloader'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'

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
  /** Custom className */
  className?: string
}

export interface VideoFeedRef {
  scrollToIndex: (index: number) => void
  scrollToNext: () => void
  scrollToPrev: () => void
  getCurrentIndex: () => number
}

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
      className = '',
    },
    ref
  ) => {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const { setCurrentIndex: storeSetCurrentIndex } = useFeedStore()

    // Virtualization
    const virtualizer = useVirtualizer({
      count: videos.length,
      getScrollElement: () => scrollRef.current,
      estimateSize: () => (typeof window !== 'undefined' ? window.innerHeight : 800),
      overscan: 2,
    })

    // Pre-loading
    const { getPreloadPriority } = usePreloader({
      videos,
      currentIndex,
    })

    // Infinite scroll
    const { sentinelRef } = useInfiniteScroll({
      onLoadMore,
      isLoading,
      hasMore,
      threshold: 2,
    })

    // Detect current video based on scroll position
    useEffect(() => {
      const scrollElement = scrollRef.current
      if (!scrollElement) return

      const handleScroll = () => {
        const scrollTop = scrollElement.scrollTop
        const viewportHeight = scrollElement.clientHeight
        const centerY = scrollTop + viewportHeight / 2

        // Find video at center of viewport
        const virtualItems = virtualizer.getVirtualItems()
        for (const item of virtualItems) {
          if (centerY >= item.start && centerY < item.end) {
            if (item.index !== currentIndex) {
              setCurrentIndex(item.index)
              storeSetCurrentIndex(item.index)

              const video = videos[item.index]
              if (video) {
                onVideoChange?.(video, item.index)
              }
            }
            break
          }
        }
      }

      scrollElement.addEventListener('scroll', handleScroll, { passive: true })
      return () => scrollElement.removeEventListener('scroll', handleScroll)
    }, [virtualizer, videos, currentIndex, onVideoChange, storeSetCurrentIndex])

    // Scroll to index
    const scrollToIndex = useCallback(
      (index: number) => {
        virtualizer.scrollToIndex(index, {
          align: 'start',
          behavior: 'smooth',
        })
      },
      [virtualizer]
    )

    const scrollToNext = useCallback(() => {
      if (currentIndex < videos.length - 1) {
        scrollToIndex(currentIndex + 1)
      }
    }, [currentIndex, videos.length, scrollToIndex])

    const scrollToPrev = useCallback(() => {
      if (currentIndex > 0) {
        scrollToIndex(currentIndex - 1)
      }
    }, [currentIndex, scrollToIndex])

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      scrollToIndex,
      scrollToNext,
      scrollToPrev,
      getCurrentIndex: () => currentIndex,
    }))

    // Scroll to initial index
    useEffect(() => {
      if (initialIndex > 0 && videos.length > initialIndex) {
        scrollToIndex(initialIndex)
      }
    }, [])

    return (
      <div
        ref={scrollRef}
        className={`
          h-screen w-full overflow-y-scroll overflow-x-hidden
          snap-y snap-mandatory
          scrollbar-hide
          bg-black
          ${className}
        `}
        style={{
          scrollSnapType: 'y mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Virtual list container */}
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const video = videos[virtualItem.index]
            if (!video) return null

            const priority = getPreloadPriority(virtualItem.index)
            const isCurrentVideo = virtualItem.index === currentIndex

            return (
              <div
                key={video.id}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className="snap-start snap-always"
              >
                <VideoFeedItem
                  video={video}
                  isActive={isCurrentVideo}
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

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-px w-full" />

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute bottom-20 left-0 right-0 flex justify-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>
    )
  }
)

VideoFeed.displayName = 'VideoFeed'
