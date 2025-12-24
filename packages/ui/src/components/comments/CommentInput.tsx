/**
 * CommentInput - Comment input component
 *
 * Uses CSS Variables + Inline Styles for maximum customizability.
 * No Tailwind CSS dependency.
 */

'use client'

import { useState, useRef, type CSSProperties, type KeyboardEvent } from 'react'
import { colors, spacing, fontSizes, radii, mergeStyles } from '@xhub-reel/design-tokens'
import { Avatar } from '../base/Avatar'
import { Spinner } from '../Spinner'

export interface CommentInputProps {
  /** Called when comment is submitted */
  onSubmit?: (content: string) => void | Promise<void>
  /** Submitting state */
  isSubmitting?: boolean
  /** Current user avatar URL */
  userAvatar?: string
  /** Reply-to username (shows @mention) */
  replyTo?: string
  /** Called when reply is cancelled */
  onCancelReply?: () => void
  /** Placeholder text */
  placeholder?: string
  /** Max length */
  maxLength?: number
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
  alignItems: 'flex-end',
  gap: spacing[3],
  padding: spacing[3],
}

const inputContainerStyles: CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing[1],
}

const replyIndicatorStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[2],
  fontSize: fontSizes.xs,
  color: colors.textSecondary,
}

const cancelButtonStyles: CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: colors.textMuted,
  fontSize: fontSizes.xs,
}

const inputWrapperStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[2],
  backgroundColor: colors.surface,
  borderRadius: radii.lg,
  padding: `${spacing[2]}px ${spacing[3]}px`,
}

const inputStyles: CSSProperties = {
  flex: 1,
  background: 'none',
  border: 'none',
  outline: 'none',
  fontSize: fontSizes.sm,
  color: colors.text,
  minHeight: 24,
  maxHeight: 100,
  resize: 'none',
}

const sendButtonStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  color: colors.accent,
  opacity: 0.5,
  transition: 'opacity 0.2s ease',
}

const sendButtonActiveStyles: CSSProperties = {
  opacity: 1,
  cursor: 'pointer',
}

const sendButtonDisabledStyles: CSSProperties = {
  opacity: 0.3,
  cursor: 'not-allowed',
}

// =============================================================================
// ICONS
// =============================================================================

const SendIcon = () => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
)

// =============================================================================
// COMPONENT
// =============================================================================

export function CommentInput({
  onSubmit,
  isSubmitting = false,
  userAvatar,
  replyTo,
  onCancelReply,
  placeholder = 'Thêm bình luận...',
  maxLength = 500,
  style,
  className = '',
}: CommentInputProps) {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const canSubmit = content.trim().length > 0 && !isSubmitting

  const handleSubmit = async () => {
    if (!canSubmit) return

    const trimmedContent = content.trim()
    await onSubmit?.(trimmedContent)
    setContent('')

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <div style={mergeStyles(containerStyles, style)} className={className}>
      <Avatar
        src={userAvatar}
        alt="You"
        size="sm"
      />

      <div style={inputContainerStyles}>
        {/* Reply indicator */}
        {replyTo && (
          <div style={replyIndicatorStyles}>
            <span>Đang trả lời @{replyTo}</span>
            <button style={cancelButtonStyles} onClick={onCancelReply}>
              ✕
            </button>
          </div>
        )}

        {/* Input wrapper */}
        <div style={inputWrapperStyles}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={replyTo ? `Trả lời @${replyTo}...` : placeholder}
            rows={1}
            disabled={isSubmitting}
            style={inputStyles}
          />

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            aria-label="Gửi bình luận"
            style={mergeStyles(
              sendButtonStyles,
              canSubmit && sendButtonActiveStyles,
              isSubmitting && sendButtonDisabledStyles
            )}
          >
            {isSubmitting ? (
              <Spinner size={16} />
            ) : (
              <SendIcon />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
