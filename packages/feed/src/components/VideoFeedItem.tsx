/**
 * VideoFeedItem - Individual video item in the feed
 */

'use client'

import { useRef, useMemo } from 'react'
import type { Video } from '@vortex/core'
import { useVideoActivation } from '../hooks/useVideoActivation'
import { useMemoryManager } from '../hooks/useMemoryManager'
import type { PreloadPriority } from '../hooks/usePreloader'

export interface VideoFeedItemProps {
  /** Video data */
  video: Video
  /** Whether this is the currently active video */
  isActive?: boolean
  /** Preload priority */
  priority?: PreloadPriority
  /** Called when video is liked */
  onLike?: () => void
  /** Called when comments button is pressed */
  onComment?: () => void
  /** Called when share button is pressed */
  onShare?: () => void
  /** Called when author is clicked */
  onAuthorClick?: () => void
  /** Custom className */
  className?: string
}

export function VideoFeedItem({
  video,
  isActive = false,
  priority = 'none',
  onLike,
  onComment,
  onShare,
  onAuthorClick,
  className = '',
}: VideoFeedItemProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Memory management
  const { setInDom, setHasDecodedFrames, shouldDispose } = useMemoryManager({
    videoId: video.id,
    onShouldDispose: () => {
      // Pause and unload video when disposed
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.src = ''
        videoRef.current.load()
      }
    },
  })

  // Video activation based on visibility
  useVideoActivation({
    containerRef,
    videoRef,
    isCurrentVideo: isActive,
    onActivate: () => {
      setHasDecodedFrames(true)
    },
    onDeactivate: () => {
      setHasDecodedFrames(false)
    },
  })

  // Mark as in DOM when mounted
  useMemo(() => {
    setInDom(true)
    return () => setInDom(false)
  }, [setInDom])

  // Should we render the video element?
  const shouldRenderVideo = !shouldDispose && priority !== 'none'

  // Preload behavior based on priority
  const preload = useMemo(() => {
    switch (priority) {
      case 'high':
        return 'auto'
      case 'medium':
        return 'metadata'
      case 'low':
      case 'metadata':
        return 'none'
      default:
        return 'none'
    }
  }, [priority])

  return (
    <div
      ref={containerRef}
      className={`
        relative w-full h-full
        bg-black
        ${className}
      `}
    >
      {/* Video element */}
      {shouldRenderVideo ? (
        <video
          ref={videoRef}
          src={video.url}
          poster={video.thumbnail}
          preload={preload}
          loop
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        /* Placeholder thumbnail when video is disposed */
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${video.thumbnail})` }}
        />
      )}

      {/* Video info overlay - bottom left */}
      <div className="absolute bottom-0 left-0 right-16 p-4 pb-safe z-10">
        {/* Author */}
        <button
          className="flex items-center gap-2 mb-3"
          onClick={onAuthorClick}
        >
          <img
            src={video.author.avatar}
            alt={video.author.displayName}
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />
          <div className="text-left">
            <span className="text-white font-semibold text-sm drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
              @{video.author.username}
            </span>
          </div>
        </button>

        {/* Caption */}
        {video.caption && (
          <p className="text-white text-sm line-clamp-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {video.caption}
          </p>
        )}

        {/* Hashtags */}
        {video.hashtags && video.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {video.hashtags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-vortex-violet text-sm font-medium drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action buttons - right side */}
      <div className="absolute right-3 bottom-32 flex flex-col items-center gap-5 z-10">
        {/* Like button */}
        <button
          className="flex flex-col items-center gap-1"
          onClick={onLike}
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm">
            <svg
              className={`w-7 h-7 ${video.isLiked ? 'text-vortex-red fill-vortex-red' : 'text-white'}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <span className="text-white text-xs font-medium drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {formatCount(video.stats.likes)}
          </span>
        </button>

        {/* Comment button */}
        <button
          className="flex flex-col items-center gap-1"
          onClick={onComment}
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm">
            <svg
              className="w-7 h-7 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="text-white text-xs font-medium drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {formatCount(video.stats.comments)}
          </span>
        </button>

        {/* Share button */}
        <button
          className="flex flex-col items-center gap-1"
          onClick={onShare}
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm">
            <svg
              className="w-7 h-7 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          </div>
          <span className="text-white text-xs font-medium drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
            {formatCount(video.stats.shares)}
          </span>
        </button>
      </div>
    </div>
  )
}

function formatCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 10000) return `${(count / 1000).toFixed(1)}K`
  if (count < 1000000) return `${Math.floor(count / 1000)}K`
  return `${(count / 1000000).toFixed(1)}M`
}

