/**
 * CommentItem - Single comment display
 */

'use client'

import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { Heart, MoreHorizontal } from 'lucide-react'
import { lightHaptic, formatCount } from '@vortex/core'
import type { Comment, User } from '@vortex/core'

export interface CommentItemProps {
  /** Comment data */
  comment: Comment
  /** Whether current user has liked this comment */
  isLiked?: boolean
  /** Called when like button is clicked */
  onLike?: () => void
  /** Called when reply button is clicked */
  onReply?: () => void
  /** Called when author avatar is clicked */
  onAuthorClick?: (author: User) => void
  /** Called when more options is clicked */
  onMoreOptions?: () => void
  /** Whether this is a reply (smaller variant) */
  isReply?: boolean
  /** Custom className */
  className?: string
}

export function CommentItem({
  comment,
  isLiked = false,
  onLike,
  onReply,
  onAuthorClick,
  onMoreOptions,
  isReply = false,
  className = '',
}: CommentItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showLikeAnimation, setShowLikeAnimation] = useState(false)

  const handleLike = useCallback(() => {
    lightHaptic()
    setShowLikeAnimation(true)
    setTimeout(() => setShowLikeAnimation(false), 300)
    onLike?.()
  }, [onLike])

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    const diffWeeks = Math.floor(diffDays / 7)

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins}p`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return `${diffWeeks}w`
  }

  const avatarSize = isReply ? 'w-8 h-8' : 'w-10 h-10'
  const textSize = isReply ? 'text-sm' : 'text-base'

  return (
    <div className={`flex gap-3 ${className}`}>
      {/* Avatar */}
      <button
        onClick={() => onAuthorClick?.(comment.author)}
        className="flex-shrink-0"
      >
        <img
          src={comment.author.avatar}
          alt={comment.author.displayName}
          className={`${avatarSize} rounded-full object-cover`}
        />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Author & Time */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAuthorClick?.(comment.author)}
            className="font-semibold text-white text-sm hover:underline"
          >
            {comment.author.username}
          </button>
          <span className="text-xs text-white/50">
            {formatTimeAgo(comment.createdAt)}
          </span>
        </div>

        {/* Comment text */}
        <div className="mt-1">
          <p
            className={`text-white/90 ${textSize} ${
              !isExpanded ? 'line-clamp-3' : ''
            }`}
          >
            {comment.content}
          </p>
          {comment.content.length > 150 && !isExpanded && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-white/50 text-sm mt-1"
            >
              Xem thêm
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-2">
          {/* Like */}
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-white/70 hover:text-white"
          >
            <motion.div
              animate={showLikeAnimation ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart
                size={16}
                className={isLiked ? 'fill-vortex-red text-vortex-red' : ''}
              />
            </motion.div>
            {comment.likesCount > 0 && (
              <span className="text-xs">{formatCount(comment.likesCount)}</span>
            )}
          </button>

          {/* Reply */}
          {!isReply && (
            <button
              onClick={onReply}
              className="flex items-center gap-1 text-white/70 hover:text-white text-xs"
            >
              Phản hồi
            </button>
          )}
        </div>
      </div>

      {/* More options */}
      <button
        onClick={onMoreOptions}
        className="flex-shrink-0 p-1 text-white/50 hover:text-white"
      >
        <MoreHorizontal size={16} />
      </button>
    </div>
  )
}

