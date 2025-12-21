/**
 * CommentInput - Input field for posting comments
 */

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'motion/react'
import { Send, Smile, AtSign } from 'lucide-react'
import { lightHaptic } from '@vortex/core'

export interface CommentInputProps {
  /** User avatar URL */
  userAvatar?: string
  /** Placeholder text */
  placeholder?: string
  /** Reply to username (shows @mention) */
  replyTo?: string
  /** Called when comment is submitted */
  onSubmit?: (text: string) => void
  /** Called when @ is typed (for mention autocomplete) */
  onMention?: (search: string) => void
  /** Whether input is disabled */
  disabled?: boolean
  /** Auto focus on mount */
  autoFocus?: boolean
  /** Custom className */
  className?: string
}

export function CommentInput({
  userAvatar,
  placeholder = 'Thêm bình luận...',
  replyTo,
  onSubmit,
  onMention,
  disabled = false,
  autoFocus = false,
  className = '',
}: CommentInputProps) {
  const [text, setText] = useState(replyTo ? `@${replyTo} ` : '')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto focus
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // Handle text change
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      setText(value)

      // Check for @mention
      const lastAtIndex = value.lastIndexOf('@')
      if (lastAtIndex !== -1) {
        const afterAt = value.slice(lastAtIndex + 1)
        const spaceIndex = afterAt.indexOf(' ')
        if (spaceIndex === -1 && afterAt.length > 0) {
          onMention?.(afterAt)
        }
      }
    },
    [onMention]
  )

  // Handle submit
  const handleSubmit = useCallback(() => {
    const trimmedText = text.trim()
    if (!trimmedText || disabled) return

    lightHaptic()
    onSubmit?.(trimmedText)
    setText(replyTo ? `@${replyTo} ` : '')
  }, [text, disabled, onSubmit, replyTo])

  // Handle key press
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  const canSubmit = text.trim().length > 0 && !disabled

  return (
    <div
      className={`flex items-end gap-3 p-3 bg-zinc-900/95 backdrop-blur-lg border-t border-white/10 ${className}`}
    >
      {/* User avatar */}
      {userAvatar && (
        <img
          src={userAvatar}
          alt="Your avatar"
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      )}

      {/* Input container */}
      <div
        className={`flex-1 flex items-end gap-2 bg-zinc-800 rounded-2xl px-4 py-2 transition-all ${
          isFocused ? 'ring-1 ring-vortex-violet' : ''
        }`}
      >
        {/* Text input */}
        <textarea
          ref={inputRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder:text-white/40 max-h-24 scrollbar-hide"
          style={{
            height: 'auto',
            minHeight: '20px',
          }}
        />

        {/* Emoji button */}
        <button
          type="button"
          className="text-white/50 hover:text-white p-1"
          aria-label="Add emoji"
        >
          <Smile size={20} />
        </button>

        {/* Mention button */}
        <button
          type="button"
          className="text-white/50 hover:text-white p-1"
          aria-label="Mention user"
          onClick={() => {
            setText((prev) => prev + '@')
            inputRef.current?.focus()
          }}
        >
          <AtSign size={20} />
        </button>
      </div>

      {/* Send button */}
      <motion.button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`p-2 rounded-full flex-shrink-0 transition-colors ${
          canSubmit
            ? 'bg-vortex-violet text-white'
            : 'bg-zinc-700 text-white/30'
        }`}
        whileTap={canSubmit ? { scale: 0.9 } : {}}
        aria-label="Send comment"
      >
        <Send size={20} />
      </motion.button>
    </div>
  )
}

