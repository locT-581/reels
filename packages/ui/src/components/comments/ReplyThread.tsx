/**
 * ReplyThread - Nested replies display
 */

'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { formatCount } from '@vortex/core'
import type { Reply, User } from '@vortex/core'
import { CommentItem } from './CommentItem'

export interface ReplyThreadProps {
  /** Replies data */
  replies: Reply[]
  /** Total reply count */
  totalReplies: number
  /** Whether more replies are available */
  hasMore?: boolean
  /** Set of liked reply IDs */
  likedReplyIds?: Set<string>
  /** Called when a reply is liked */
  onLikeReply?: (replyId: string) => void
  /** Called when author is clicked */
  onAuthorClick?: (author: User) => void
  /** Called when more replies should be loaded */
  onLoadMore?: () => void
  /** Loading more state */
  isLoadingMore?: boolean
  /** Custom className */
  className?: string
}

export function ReplyThread({
  replies,
  totalReplies,
  hasMore = false,
  likedReplyIds = new Set(),
  onLikeReply,
  onAuthorClick,
  onLoadMore,
  isLoadingMore = false,
  className = '',
}: ReplyThreadProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const visibleReplies = isExpanded ? replies : replies.slice(0, 2)
  const hiddenCount = totalReplies - visibleReplies.length

  const toggleExpand = useCallback(() => {
    if (!isExpanded && hasMore && replies.length < totalReplies) {
      onLoadMore?.()
    }
    setIsExpanded(!isExpanded)
  }, [isExpanded, hasMore, replies.length, totalReplies, onLoadMore])

  if (replies.length === 0) return null

  return (
    <div className={`ml-12 mt-2 ${className}`}>
      {/* Replies */}
      <AnimatePresence mode="popLayout">
        {visibleReplies.map((reply, index) => (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ delay: index * 0.05 }}
            className="mb-3"
          >
            <CommentItem
              comment={{
                ...reply,
                repliesCount: 0,
              }}
              isLiked={likedReplyIds.has(reply.id)}
              onLike={() => onLikeReply?.(reply.id)}
              onAuthorClick={onAuthorClick}
              isReply
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Expand/collapse button */}
      {(hiddenCount > 0 || isExpanded) && (
        <button
          onClick={toggleExpand}
          disabled={isLoadingMore}
          className="flex items-center gap-1 text-white/50 hover:text-white text-sm mt-1 disabled:opacity-50"
        >
          {isLoadingMore ? (
            <span>Đang tải...</span>
          ) : isExpanded ? (
            <>
              <ChevronUp size={16} />
              <span>Ẩn phản hồi</span>
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              <span>Xem {formatCount(hiddenCount)} phản hồi</span>
            </>
          )}
        </button>
      )}
    </div>
  )
}

