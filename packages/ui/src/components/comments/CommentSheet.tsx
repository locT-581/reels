/**
 * CommentSheet - Comment bottom sheet with scrollable list
 *
 * Uses CSS Variables + Inline Styles for maximum customizability.
 * No Tailwind CSS dependency.
 */

'use client'

import { useState, useCallback, useRef, type CSSProperties } from 'react'
import { colors, spacing, fontSizes, fontWeights } from '@xhub-reel/design-tokens'
import type { Comment } from '@xhub-reel/types'
import { formatCount } from '../../utils'
import { BottomSheet } from '../BottomSheet'
import { CommentItem } from './CommentItem'
import { CommentInput } from './CommentInput'
import { Spinner } from '../Spinner'

export interface CommentSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean
  /** Called when sheet should close */
  onClose: () => void
  /** Comments to display */
  comments: Comment[]
  /** Total comment count */
  totalCount?: number
  /** Called when a new comment is submitted */
  onSubmit?: (content: string) => void | Promise<void>
  /** Called when a comment is liked */
  onLikeComment?: (commentId: string) => void
  /** Called when reply is initiated */
  onReply?: (comment: Comment) => void
  /** Called when more comments should be loaded */
  onLoadMore?: () => void | Promise<void>
  /** Loading state */
  isLoading?: boolean
  /** Has more comments to load */
  hasMore?: boolean
  /** Submitting state */
  isSubmitting?: boolean
  /** Current user avatar */
  userAvatar?: string
  /** Custom styles override */
  style?: CSSProperties
}

// =============================================================================
// STYLES
// =============================================================================

const contentStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}

const listContainerStyles: CSSProperties = {
  flex: 1,
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
}

const loadingStyles: CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  padding: spacing[4],
}

const emptyStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing[8],
  color: colors.textSecondary,
  textAlign: 'center',
}

const emptyTitleStyles: CSSProperties = {
  fontSize: fontSizes.lg,
  fontWeight: fontWeights.semibold,
  color: colors.text,
  marginBottom: spacing[2],
}

const emptyTextStyles: CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.textMuted,
}

const inputContainerStyles: CSSProperties = {
  borderTop: `1px solid ${colors.border}`,
  paddingBottom: 'env(safe-area-inset-bottom, 0px)',
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CommentSheet({
  isOpen,
  onClose,
  comments,
  totalCount = comments.length,
  onSubmit,
  onLikeComment,
  onReply,
  onLoadMore,
  isLoading = false,
  hasMore = false,
  isSubmitting = false,
  userAvatar,
  style,
}: CommentSheetProps) {
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Handle scroll to bottom for infinite loading
  const handleScroll = useCallback(() => {
    if (!listRef.current || isLoading || !hasMore) return

    const { scrollTop, scrollHeight, clientHeight } = listRef.current
    if (scrollHeight - scrollTop - clientHeight < 200) {
      onLoadMore?.()
    }
  }, [isLoading, hasMore, onLoadMore])

  // Handle reply
  const handleReply = useCallback((comment: Comment) => {
    setReplyTo(comment)
    onReply?.(comment)
  }, [onReply])

  // Handle submit
  const handleSubmit = useCallback(async (content: string) => {
    await onSubmit?.(content)
    setReplyTo(null)
  }, [onSubmit])

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={`${formatCount(totalCount)} bình luận`}
      height="70vh"
      style={style}
    >
      <div style={contentStyles}>
        {/* Comment list */}
        <div
          ref={listRef}
          style={listContainerStyles}
          onScroll={handleScroll}
        >
          {comments.length === 0 && !isLoading ? (
            <div style={emptyStyles}>
              <p style={emptyTitleStyles}>Chưa có bình luận</p>
              <p style={emptyTextStyles}>Hãy là người đầu tiên bình luận!</p>
            </div>
          ) : (
            <>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onLike={() => onLikeComment?.(comment.id)}
                  onReply={() => handleReply(comment)}
                />
              ))}
            </>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div style={loadingStyles}>
              <Spinner size={20} />
            </div>
          )}
        </div>

        {/* Comment input */}
        <div style={inputContainerStyles}>
          <CommentInput
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            userAvatar={userAvatar}
            replyTo={replyTo?.author.username}
            onCancelReply={() => setReplyTo(null)}
          />
        </div>
      </div>
    </BottomSheet>
  )
}
