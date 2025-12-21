/**
 * CommentSheet - Bottom sheet for displaying comments
 */

'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useDragControls, PanInfo } from 'motion/react'
import { X } from 'lucide-react'
import { SPRING, formatCount } from '@vortex/core'
import type { Comment, User } from '@vortex/core'
import { CommentItem } from './CommentItem'
import { CommentInput } from './CommentInput'
import { Spinner } from '../Spinner'

export interface CommentSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean
  /** Called when sheet should close */
  onClose: () => void
  /** Comments data */
  comments: Comment[]
  /** Total comment count */
  commentCount: number
  /** Current user avatar */
  userAvatar?: string
  /** Loading state */
  isLoading?: boolean
  /** Loading more state */
  isLoadingMore?: boolean
  /** Whether there are more comments */
  hasMore?: boolean
  /** Called when more comments should be loaded */
  onLoadMore?: () => void
  /** Called when a comment is liked */
  onLikeComment?: (commentId: string) => void
  /** Called when reply is initiated */
  onReply?: (comment: Comment) => void
  /** Called when a new comment is posted */
  onPostComment?: (text: string) => void
  /** Called when author is clicked */
  onAuthorClick?: (author: User) => void
  /** Set of liked comment IDs */
  likedCommentIds?: Set<string>
}

export function CommentSheet({
  isOpen,
  onClose,
  comments,
  commentCount,
  userAvatar,
  isLoading = false,
  isLoadingMore = false,
  hasMore = false,
  onLoadMore,
  onLikeComment,
  onReply,
  onPostComment,
  onAuthorClick,
  likedCommentIds = new Set(),
}: CommentSheetProps) {
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [sheetHeight, setSheetHeight] = useState(60) // percentage
  const dragControls = useDragControls()
  const contentRef = useRef<HTMLDivElement>(null)

  // Handle drag to resize/dismiss
  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const velocity = info.velocity.y
      const offset = info.offset.y

      if (velocity > 500 || offset > 200) {
        // Dismiss
        onClose()
      } else if (velocity < -500 || offset < -100) {
        // Expand to max
        setSheetHeight(90)
      } else {
        // Snap to nearest
        if (sheetHeight < 50) {
          onClose()
        } else if (sheetHeight < 75) {
          setSheetHeight(60)
        } else {
          setSheetHeight(90)
        }
      }
    },
    [sheetHeight, onClose]
  )

  // Handle scroll to load more
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget
      const isNearBottom =
        target.scrollHeight - target.scrollTop - target.clientHeight < 100

      if (isNearBottom && hasMore && !isLoadingMore) {
        onLoadMore?.()
      }
    },
    [hasMore, isLoadingMore, onLoadMore]
  )

  // Handle reply
  const handleReply = useCallback((comment: Comment) => {
    setReplyTo(comment)
    onReply?.(comment)
  }, [onReply])

  // Handle post comment
  const handlePostComment = useCallback(
    (text: string) => {
      onPostComment?.(text)
      setReplyTo(null)
    },
    [onPostComment]
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900 rounded-t-3xl overflow-hidden flex flex-col"
            style={{ height: `${sheetHeight}vh` }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: SPRING.DEFAULT.stiffness,
              damping: SPRING.DEFAULT.damping,
            }}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.1, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
          >
            {/* Drag handle */}
            <div
              className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-white/10">
              <h3 className="text-base font-semibold text-white">
                {formatCount(commentCount)} bình luận
              </h3>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-white/10"
                aria-label="Close"
              >
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Comments list */}
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto px-4 py-3"
              onScroll={handleScroll}
            >
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="md" />
                </div>
              ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-white/50">
                  <p className="text-sm">Chưa có bình luận nào</p>
                  <p className="text-xs mt-1">Hãy là người đầu tiên bình luận!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      isLiked={likedCommentIds.has(comment.id)}
                      onLike={() => onLikeComment?.(comment.id)}
                      onReply={() => handleReply(comment)}
                      onAuthorClick={onAuthorClick}
                    />
                  ))}

                  {/* Load more indicator */}
                  {isLoadingMore && (
                    <div className="flex justify-center py-4">
                      <Spinner size="sm" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Input */}
            <CommentInput
              userAvatar={userAvatar}
              replyTo={replyTo?.author.username}
              onSubmit={handlePostComment}
              placeholder={
                replyTo
                  ? `Trả lời @${replyTo.author.username}...`
                  : 'Thêm bình luận...'
              }
            />

            {/* Safe area */}
            <div className="h-safe-bottom bg-zinc-900" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

