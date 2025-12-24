/**
 * ShareSheet - Share options bottom sheet
 *
 * Uses CSS Variables + Inline Styles for maximum customizability.
 * No Tailwind CSS dependency.
 */

'use client'

import { type CSSProperties, type ReactNode } from 'react'
import { colors, spacing, fontSizes, fontWeights, radii } from '@xhub-reel/design-tokens'
import { BottomSheet } from '../BottomSheet'
import { Toast } from '../Toast'
import { useState, useCallback } from 'react'

export interface ShareOption {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Icon component */
  icon: ReactNode
  /** Click handler */
  onClick: () => void
  /** Background color */
  color?: string
}

export interface ShareSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean
  /** Called when sheet should close */
  onClose: () => void
  /** Video URL to share */
  videoUrl: string
  /** Video title for sharing */
  videoTitle?: string
  /** Custom share options (overrides defaults) */
  customOptions?: ShareOption[]
  /** Called when link is copied */
  onCopyLink?: () => void
  /** Called when native share is triggered */
  onNativeShare?: () => void
  /** Custom styles override */
  style?: CSSProperties
}

// =============================================================================
// STYLES
// =============================================================================

const contentStyles: CSSProperties = {
  padding: spacing[4],
}

const optionsGridStyles: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: spacing[4],
  marginBottom: spacing[4],
}

const optionButtonStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[2],
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
}

const optionIconStyles: CSSProperties = {
  width: 56,
  height: 56,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: radii.lg,
}

const optionLabelStyles: CSSProperties = {
  fontSize: fontSizes.xs,
  color: colors.textSecondary,
  textAlign: 'center',
}

const dividerStyles: CSSProperties = {
  height: 1,
  backgroundColor: colors.border,
  margin: `${spacing[4]}px 0`,
}

const linkPreviewStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  padding: spacing[3],
  backgroundColor: colors.surface,
  borderRadius: radii.lg,
}

const linkTextStyles: CSSProperties = {
  flex: 1,
  fontSize: fontSizes.sm,
  color: colors.textSecondary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const copyButtonStyles: CSSProperties = {
  padding: `${spacing[2]}px ${spacing[3]}px`,
  backgroundColor: colors.accent,
  color: colors.white,
  border: 'none',
  borderRadius: radii.md,
  fontSize: fontSizes.sm,
  fontWeight: fontWeights.medium,
  cursor: 'pointer',
}

// =============================================================================
// ICONS
// =============================================================================

const CopyIcon = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const MessageIcon = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const MoreIcon = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
)

const LinkIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)

// =============================================================================
// DEFAULT OPTIONS
// =============================================================================

const getDefaultOptions = (onAction: (type: string) => void): ShareOption[] => [
  {
    id: 'copy',
    name: 'Sao chép',
    icon: <CopyIcon />,
    onClick: () => onAction('copy'),
    color: '#6B7280',
  },
  {
    id: 'message',
    name: 'Tin nhắn',
    icon: <MessageIcon />,
    onClick: () => onAction('message'),
    color: '#22C55E',
  },
  {
    id: 'more',
    name: 'Thêm',
    icon: <MoreIcon />,
    onClick: () => onAction('more'),
    color: '#8B5CF6',
  },
]

// =============================================================================
// COMPONENT
// =============================================================================

export function ShareSheet({
  isOpen,
  onClose,
  videoUrl,
  videoTitle = '',
  customOptions,
  onCopyLink,
  onNativeShare,
  style,
}: ShareSheetProps) {
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const handleAction = useCallback(async (type: string) => {
    switch (type) {
      case 'copy':
        await navigator.clipboard?.writeText(videoUrl)
        setToastMessage('Đã sao chép link!')
        setShowToast(true)
        onCopyLink?.()
        break

      case 'more':
        if (navigator.share) {
          try {
            await navigator.share({
              title: videoTitle,
              url: videoUrl,
            })
            onNativeShare?.()
          } catch {
            // User cancelled or share failed
          }
        }
        break

      case 'message':
        // Open SMS with link
        window.location.href = `sms:?body=${encodeURIComponent(videoUrl)}`
        break
    }
  }, [videoUrl, videoTitle, onCopyLink, onNativeShare])

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard?.writeText(videoUrl)
    setToastMessage('Đã sao chép link!')
    setShowToast(true)
    onCopyLink?.()
  }, [videoUrl, onCopyLink])

  const options = customOptions || getDefaultOptions(handleAction)

  return (
    <>
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title="Chia sẻ"
        height="auto"
        style={style}
      >
        <div style={contentStyles}>
          {/* Share options grid */}
          <div style={optionsGridStyles}>
            {options.map((option) => (
              <button
                key={option.id}
                style={optionButtonStyles}
                onClick={() => {
                  option.onClick()
                  onClose()
                }}
              >
                <div
                  style={{
                    ...optionIconStyles,
                    backgroundColor: option.color || colors.surface,
                    color: colors.white,
                  }}
                >
                  {option.icon}
                </div>
                <span style={optionLabelStyles}>{option.name}</span>
              </button>
            ))}
          </div>

          <div style={dividerStyles} />

          {/* Link preview and copy */}
          <div style={linkPreviewStyles}>
            <LinkIcon />
            <span style={linkTextStyles}>{videoUrl}</span>
            <button style={copyButtonStyles} onClick={handleCopyLink}>
              Sao chép
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Toast notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        variant="success"
      />
    </>
  )
}
