/**
 * CommentItem - Individual comment component
 *
 * Uses CSS Variables + Inline Styles for maximum customizability.
 * No Tailwind CSS dependency.
 */

'use client'

import { type CSSProperties } from 'react'
import type { Comment } from '@vortex/types'
import { colors, spacing, fontSizes, fontWeights, mergeStyles } from '@vortex/design-tokens'
import { Avatar } from '../base/Avatar'

export interface CommentItemProps {
  /** Comment data */
  comment: Comment
  /** Called when like is pressed */
  onLike?: () => void
  /** Called when reply is pressed */
  onReply?: () => void
  /** Whether this is a reply (indented) */
  isReply?: boolean
  /** Custom styles override */
  style?: CSSProperties
  /** Custom className (for external CSS if needed) */
  className?: string
}

// =============================================================================
// STYLES
// =============================================================================

const containerStyles: CSSProperties = {
  display: 'flex',
  gap: spacing[3],
  padding: `${spacing[3]}px ${spacing[4]}px`,
}

const replyContainerStyles: CSSProperties = {
  marginLeft: 40, // Avatar size + gap
}

const contentStyles: CSSProperties = {
  flex: 1,
  minWidth: 0,
}

const headerStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[2],
  marginBottom: spacing[1],
}

const usernameStyles: CSSProperties = {
  fontSize: fontSizes.sm,
  fontWeight: fontWeights.semibold,
  color: colors.text,
}

const timeStyles: CSSProperties = {
  fontSize: fontSizes.xs,
  color: colors.textMuted,
}

const textStyles: CSSProperties = {
  fontSize: fontSizes.sm,
  color: colors.text,
  lineHeight: 1.4,
  wordBreak: 'break-word',
}

const actionsStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[4],
  marginTop: spacing[2],
}

const actionButtonStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[1],
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontSize: fontSizes.xs,
  color: colors.textSecondary,
}

const likeCountStyles: CSSProperties = {
  fontSize: fontSizes.xs,
  color: colors.textSecondary,
}

// =============================================================================
// ICONS
// =============================================================================

const HeartIcon = ({ filled, size = 14 }: { filled?: boolean; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? colors.like : 'none'}
    stroke={filled ? colors.like : 'currentColor'}
    strokeWidth={2}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

// =============================================================================
// HELPER
// =============================================================================

function formatTimeAgo(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (seconds < 60) return 'Vừa xong'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}ph`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`
  return `${Math.floor(seconds / 604800)}w`
}

// =============================================================================
// COMPONENT
// =============================================================================

export function CommentItem({
  comment,
  onLike,
  onReply,
  isReply = false,
  style,
  className = '',
}: CommentItemProps) {
  return (
    <div
      style={mergeStyles(
        containerStyles,
        isReply && replyContainerStyles,
        style
      )}
      className={className}
    >
      <Avatar
        src={comment.author.avatar}
        alt={comment.author.displayName}
        size={isReply ? 'sm' : 'md'}
      />

      <div style={contentStyles}>
        {/* Header */}
        <div style={headerStyles}>
          <span style={usernameStyles}>@{comment.author.username}</span>
          <span style={timeStyles}>{formatTimeAgo(comment.createdAt)}</span>
        </div>

        {/* Content */}
        <p style={textStyles}>{comment.content}</p>

        {/* Actions */}
        <div style={actionsStyles}>
          <button style={actionButtonStyles} onClick={onLike}>
            <HeartIcon filled={comment.isLiked} />
            {comment.likesCount > 0 && (
              <span style={likeCountStyles}>{comment.likesCount}</span>
            )}
          </button>

          <button style={actionButtonStyles} onClick={onReply}>
            Trả lời
          </button>
        </div>
      </div>
    </div>
  )
}
