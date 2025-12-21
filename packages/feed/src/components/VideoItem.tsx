/**
 * VideoItem - Individual video item in the feed
 */

'use client'

import { type ReactNode } from 'react'
import type { Video } from '@vortex/core'

export interface VideoItemProps {
  video: Video
  isActive: boolean
  children: ReactNode
  onTap?: () => void
  className?: string
}

export function VideoItem({
  video,
  isActive,
  children,
  onTap,
  className = '',
}: VideoItemProps) {
  return (
    <div
      className={`relative h-full w-full bg-vortex-black ${className}`}
      onClick={onTap}
      data-video-id={video.id}
      data-active={isActive}
    >
      {/* Video content */}
      <div className="absolute inset-0">{children}</div>

      {/* Video info overlay */}
      <div className="absolute bottom-0 left-0 right-16 p-4 pb-safe">
        {/* Author */}
        <div className="mb-2 flex items-center gap-2">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-white/10">
            {video.author.avatar && (
              <img
                src={video.author.avatar}
                alt={video.author.displayName}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            )}
          </div>
          <div>
            <p className="font-semibold text-white text-video-overlay">
              @{video.author.username}
            </p>
            {video.author.isVerified && (
              <span className="text-xs text-vortex-violet">✓ Verified</span>
            )}
          </div>
        </div>

        {/* Caption */}
        <p className="line-clamp-2 text-sm text-white text-video-overlay">
          {video.caption}
        </p>

        {/* Hashtags */}
        {video.hashtags.length > 0 && (
          <p className="mt-1 text-sm font-medium text-white text-video-overlay">
            {video.hashtags.slice(0, 3).map((tag) => `#${tag}`).join(' ')}
          </p>
        )}

        {/* Sound */}
        {video.sound && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-white/70 text-video-overlay">
              🎵 {video.sound.title} - {video.sound.artist}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

