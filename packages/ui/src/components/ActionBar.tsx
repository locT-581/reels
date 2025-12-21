/**
 * ActionBar - Vertical action bar for video interactions
 */

'use client'

import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'
import { motion } from 'motion/react'
import { IconButton } from './IconButton'
import { ANIMATION } from '@vortex/core'
import type { VideoStats } from '@vortex/core'

export interface ActionBarProps {
  stats: VideoStats
  isLiked?: boolean
  isSaved?: boolean
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
  onSave?: () => void
  className?: string
}

export function ActionBar({
  stats,
  isLiked = false,
  isSaved = false,
  onLike,
  onComment,
  onShare,
  onSave,
  className = '',
}: ActionBarProps) {
  return (
    <div
      className={`flex flex-col items-center gap-4 ${className}`}
      role="toolbar"
      aria-label="Video actions"
    >
      {/* Like Button */}
      <div className="flex flex-col items-center">
        <motion.div
          animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
          transition={{
            type: 'spring',
            stiffness: ANIMATION.SPRING_STIFFNESS,
            damping: ANIMATION.SPRING_DAMPING,
          }}
        >
          <IconButton
            icon={
              <Heart
                className={isLiked ? 'fill-vortex-red text-vortex-red' : ''}
              />
            }
            label={isLiked ? 'Unlike' : 'Like'}
            isActive={isLiked}
            onClick={onLike}
          />
        </motion.div>
        <span className="text-xs font-medium text-white text-video-overlay">
          {formatCount(stats.likes)}
        </span>
      </div>

      {/* Comment Button */}
      <div className="flex flex-col items-center">
        <IconButton
          icon={<MessageCircle />}
          label="Comments"
          onClick={onComment}
        />
        <span className="text-xs font-medium text-white text-video-overlay">
          {formatCount(stats.comments)}
        </span>
      </div>

      {/* Share Button */}
      <div className="flex flex-col items-center">
        <IconButton icon={<Share2 />} label="Share" onClick={onShare} />
        <span className="text-xs font-medium text-white text-video-overlay">
          {formatCount(stats.shares)}
        </span>
      </div>

      {/* Save Button */}
      <div className="flex flex-col items-center">
        <IconButton
          icon={
            <Bookmark
              className={isSaved ? 'fill-vortex-violet text-vortex-violet' : ''}
            />
          }
          label={isSaved ? 'Unsave' : 'Save'}
          isActive={isSaved}
          variant="accent"
          onClick={onSave}
        />
      </div>
    </div>
  )
}

// Helper to format count
function formatCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 10000) return `${(count / 1000).toFixed(1)}K`
  if (count < 1000000) return `${Math.floor(count / 1000)}K`
  return `${(count / 1000000).toFixed(1)}M`
}

